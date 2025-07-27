import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    preferredMaterials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rawMaterial",
      },
    ],
  },
  { timestamps: true }
);

const vendorModel =
  mongoose.models.vendor || mongoose.model("vendor", vendorSchema);

export default vendorModel;
