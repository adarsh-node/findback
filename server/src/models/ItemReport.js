import mongoose from "mongoose";

const itemReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    category: {
      type: String,
      enum: [
        "electronics",
        "documents",
        "wallet-money",
        "bags",
        "keys",
        "jewelry",
        "clothing",
        "vehicles",
        "pets",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    date: {
      type: Date,
      required: true,
    },

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },

      point: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },

        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

    status: {
      type: String,
      enum: ["active", "matched", "claimed", "returned", "closed"],
      default: "active",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

itemReportSchema.index({
  "location.point": "2dsphere",
});

const ItemReport = mongoose.model("ItemReport", itemReportSchema);

export default ItemReport;