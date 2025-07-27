import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: {
    type: String,
    required: true,
    enum: [
      "kg",
      "g",
      "dozen",
      "litre",
      "ml",
      "piece",
      "bundle",
      "box",
      "packet",
      "tray",
    ],
  },
  category: { type: String, required: true },
});

const rawMaterialModel =
  mongoose.models.rawMaterial ||
  mongoose.model("rawMaterial", rawMaterialSchema);

export default rawMaterialModel;
