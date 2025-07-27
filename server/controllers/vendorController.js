import supplierModel from "../models/supplier.model.js";

export const PredictPriceController = async (req, res) => {
  try {
    const { materialId } = req.body;
    if (!materialId) {
      return res.status(400).send({
        success: false,
        message: "materialId is required",
      });
    }

    const suppliers = await supplierModel.find({
      "rawMaterials.materialId": materialId,
    });

    let prices = [];
    suppliers.forEach((supplier) => {
      supplier.rawMaterials.forEach((rm) => {
        if (rm.materialId.toString() === materialId) {
          prices.push(rm.price);
        }
      });
    });

    if (prices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No price data found for this material",
      });
    }

    const predictedPrice =
      prices.reduce((acc, val) => acc + val, 0) / prices.length;

    return res.json({
      success: true,
      materialId,
      predictedPrice,
      prices,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "Something error in Predicting Price",
    });
  }
};
