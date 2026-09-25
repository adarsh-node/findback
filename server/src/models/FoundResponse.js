import mongoose from "mongoose";

const foundResponseSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemReport",
      required: true,
    },

    finder: {
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

    finderConfirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

foundResponseSchema.index(
  { report: 1, finder: 1 },
  { unique: true },
);

const FoundResponse = mongoose.model(
  "FoundResponse",
  foundResponseSchema,
);

export default FoundResponse;