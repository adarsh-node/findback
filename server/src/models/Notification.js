import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "claim_received",
        "claim_approved",
        "claim_rejected",
        "handover_started",
        "handover_completed",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemReport",
      default: null,
    },

    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
