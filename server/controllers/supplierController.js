import supplierModel from "../models/supplier.model.js";
import rawMaterialModel from "../models/rawMaterial.model.js";
import { v2 as cloudinary } from "cloudinary";

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

export const addRawMaterial = async (req, res) => {
  try {
    const { name, unit, category } = req.body;

    // Create new raw material
    const newRawMaterial = new rawMaterialModel({
      name,
      unit,
      category,
    });

    await newRawMaterial.save();

    res.status(201).json({
      success: true,
      message: "Raw material added successfully",
      rawMaterial: newRawMaterial,
    });
  } catch (error) {
    console.error("Error adding raw material:", error);
    res.status(500).json({
      success: false,
      message: "Error adding raw material",
      error: error.message,
    });
  }
};

export const updateRawMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const updateData = req.body;

    const updatedMaterial = await rawMaterialModel.findByIdAndUpdate(
      materialId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Raw material updated successfully",
      rawMaterial: updatedMaterial,
    });
  } catch (error) {
    console.error("Error updating raw material:", error);
    res.status(500).json({
      success: false,
      message: "Error updating raw material",
      error: error.message,
    });
  }
};

export const deleteRawMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await rawMaterialModel.findById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found",
      });
    }

    await rawMaterialModel.findByIdAndDelete(materialId);

    res.status(200).json({
      success: true,
      message: "Raw material deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting raw material:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting raw material",
      error: error.message,
    });
  }
};
