import supplierModel from "../models/supplier.model.js";

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel
      .find()
      .populate("rawMaterials.materialId");
    return res.json({ success: true, suppliers });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await supplierModel
      .findById(id)
      .populate("rawMaterials.materialId");
    if (!supplier) {
      return res.json({ success: false, message: "Supplier not found" });
    }
    return res.json({ success: true, supplier });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
