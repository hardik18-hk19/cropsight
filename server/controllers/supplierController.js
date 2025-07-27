import supplierModel from "../models/supplier.model.js";
import rawMaterialModel from "../models/rawMaterial.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel
      .find()
      .populate("userId", "name email")
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
      .populate("userId", "name email")
      .populate("rawMaterials.materialId");
    if (!supplier) {
      return res.json({ success: false, message: "Supplier not found" });
    }
    return res.json({ success: true, supplier });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get current user's supplier data
export const getMySupplierData = async (req, res) => {
  try {
    const userId = req.userId;

    let supplier = await supplierModel
      .findOne({ userId })
      .populate("userId", "name email")
      .populate("rawMaterials.materialId");

    // If supplier doesn't exist, create an empty one
    if (!supplier) {
      supplier = new supplierModel({
        userId,
        rawMaterials: [],
      });
      await supplier.save();
      await supplier.populate("userId", "name email");
    }

    return res.json({ success: true, supplier });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const addRawMaterial = async (req, res) => {
  try {
    const {
      name,
      unit,
      category,
      price,
      quantity = 0,
      availability = true,
      description,
    } = req.body;

    // Get the logged-in user's ID from the middleware
    const userId = req.userId;

    // Validate required fields
    if (!name || !unit || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, unit, category, and price are required",
      });
    }

    // Check if raw material already exists
    let rawMaterial = await rawMaterialModel.findOne({
      name: name.toLowerCase(),
      category,
    });

    // If raw material doesn't exist, create it
    if (!rawMaterial) {
      rawMaterial = new rawMaterialModel({
        name,
        unit,
        category,
      });
      await rawMaterial.save();
    }

    // Find the supplier by userId (logged-in user)
    let supplier = await supplierModel.findOne({ userId });

    // If supplier doesn't exist, create one
    if (!supplier) {
      supplier = new supplierModel({
        userId,
        rawMaterials: [],
      });
    }

    // Check if this material is already in supplier's list
    const existingMaterial = supplier.rawMaterials.find(
      (rm) => rm.materialId.toString() === rawMaterial._id.toString()
    );

    if (existingMaterial) {
      return res.status(400).json({
        success: false,
        message: "This raw material is already added by you",
      });
    }

    // Add material to supplier's raw materials array
    supplier.rawMaterials.push({
      materialId: rawMaterial._id,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      availability: availability,
      description: description || "",
    });

    await supplier.save();

    // Populate the response
    await supplier.populate("rawMaterials.materialId");

    res.status(201).json({
      success: true,
      message: "Raw material added successfully",
      rawMaterial: rawMaterial,
      supplier: supplier,
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
    const { price, quantity, availability, description } = req.body;

    // Get the logged-in user's ID from the middleware
    const userId = req.userId;

    // Find the supplier by userId (logged-in user)
    const supplier = await supplierModel.findOne({ userId });
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "You are not registered as a supplier",
      });
    }

    // Find the material in supplier's raw materials array
    const materialIndex = supplier.rawMaterials.findIndex(
      (rm) => rm.materialId.toString() === materialId
    );

    if (materialIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found in your inventory",
      });
    }

    // Update the material
    if (price !== undefined)
      supplier.rawMaterials[materialIndex].price = parseFloat(price);
    if (quantity !== undefined)
      supplier.rawMaterials[materialIndex].quantity = parseInt(quantity);
    if (availability !== undefined)
      supplier.rawMaterials[materialIndex].availability = availability;
    if (description !== undefined)
      supplier.rawMaterials[materialIndex].description = description;

    await supplier.save();

    // Populate the response
    await supplier.populate("rawMaterials.materialId");

    res.status(200).json({
      success: true,
      message: "Raw material updated successfully",
      supplier: supplier,
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

    // Get the logged-in user's ID from the middleware
    const userId = req.userId;

    // Find the supplier by userId (logged-in user)
    const supplier = await supplierModel.findOne({ userId });
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "You are not registered as a supplier",
      });
    }

    // Find and remove the material from supplier's raw materials array
    const materialIndex = supplier.rawMaterials.findIndex(
      (rm) => rm.materialId.toString() === materialId
    );

    if (materialIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found in your inventory",
      });
    }

    // Remove the material from array
    supplier.rawMaterials.splice(materialIndex, 1);
    await supplier.save();

    res.status(200).json({
      success: true,
      message: "Raw material removed successfully",
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
