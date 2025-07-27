import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    rawMaterials: [
      {
        materialId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "rawMaterial",
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const supplierModel =
  mongoose.models.supplier || mongoose.model("supplier", supplierSchema);

export default supplierModel;
