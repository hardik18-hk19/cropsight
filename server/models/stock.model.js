import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supplier",
      required: true,
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rawMaterial",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        alt_text: {
          type: String,
          default: "",
        },
      },
    ],
    location: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    harvestDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    qualityGrade: {
      type: String,
      enum: ["A", "B", "C", "Premium"],
      default: "A",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
stockSchema.index({ supplierId: 1, materialId: 1 });
stockSchema.index({ materialId: 1, availability: 1 });
stockSchema.index({ location: 1 });

const stockModel =
  mongoose.models.stock || mongoose.model("stock", stockSchema);

export default stockModel;
