import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  rawMaterials: [
    {
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
      availability: {
        type: Boolean,
        default: true,
      },
      quantity: {
        type: Number,
        min: 0,
        default: 0,
      },
      description: {
        type: String,
        maxlength: 500,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const supplierModel =
  mongoose.models.supplier || mongoose.model("supplier", supplierSchema);

export default supplierModel;
