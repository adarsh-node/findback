import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemReport",
      required: true,
    },

    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    ownerConfirmedAt: {
      type: Date,
      default: null,
    },

    claimantConfirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

claimSchema.index({ report: 1, claimant: 1 }, { unique: true });

const Claim = mongoose.model("Claim", claimSchema);

export default Claim;
