import Stock from "../models/stock.model.js";
import { v2 as cloudinary } from "cloudinary";

// Add new stock
const addStock = async (req, res) => {
  try {
    const { supplierId, materialId, quantity, pricePerUnit, description } =
      req.body;
    const userId = req.userId; // Get user ID from auth middleware

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    const newStock = new Stock({
      userId, // Add user ownership
      supplierId,
      materialId,
      quantity,
      pricePerUnit,
      description,
      images: imageUrls,
    });

    await newStock.save();
    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      stock: newStock,
    });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({
      success: false,
      message: "Error adding stock",
      error: error.message,
    });
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const updateData = req.body;
    const userId = req.userId; // Get user ID from auth middleware

    // First check if the stock exists and belongs to the user
    const existingStock = await Stock.findById(stockId);
    if (!existingStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Check ownership
    if (existingStock.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own stocks.",
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path);
    }

    const updatedStock = await Stock.findByIdAndUpdate(stockId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      stock: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({
      success: false,
      message: "Error updating stock",
      error: error.message,
    });
  }
};

// Delete stock
const deleteStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const userId = req.userId; // Get user ID from auth middleware

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Check ownership
    if (stock.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own stocks.",
      });
    }

    // Delete associated images from cloudinary
    if (stock.images && stock.images.length > 0) {
      for (const imageUrl of stock.images) {
        try {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (imageError) {
          console.error("Error deleting image:", imageError);
        }
      }
    }

    await Stock.findByIdAndDelete(stockId);
    res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting stock",
      error: error.message,
    });
  }
};

// Get stocks by supplier
const getStocksBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const stocks = await Stock.find({ supplierId }).populate(
      "materialId supplierId"
    );

    res.status(200).json({
      success: true,
      stocks,
    });
  } catch (error) {
    console.error("Error fetching stocks by supplier:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stocks",
      error: error.message,
    });
  }
};

// Get stocks by material
const getStocksByMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const stocks = await Stock.find({ materialId }).populate(
      "materialId supplierId"
    );

    res.status(200).json({
      success: true,
      stocks,
    });
  } catch (error) {
    console.error("Error fetching stocks by material:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stocks",
      error: error.message,
    });
  }
};

// Get all stocks
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().populate("materialId supplierId userId");

    res.status(200).json({
      success: true,
      stocks,
    });
  } catch (error) {
    console.error("Error fetching all stocks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stocks",
      error: error.message,
    });
  }
};

// Get user's own stocks
const getUserStocks = async (req, res) => {
  try {
    const userId = req.userId; // Get user ID from auth middleware
    const stocks = await Stock.find({ userId }).populate(
      "materialId supplierId userId"
    );

    res.status(200).json({
      success: true,
      stocks,
    });
  } catch (error) {
    console.error("Error fetching user stocks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user stocks",
      error: error.message,
    });
  }
};

// Get stock by ID
const getStockById = async (req, res) => {
  try {
    const { stockId } = req.params;
    const stock = await Stock.findById(stockId).populate(
      "materialId supplierId"
    );

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    res.status(200).json({
      success: true,
      stock,
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stock",
      error: error.message,
    });
  }
};

export {
  addStock,
  updateStock,
  deleteStock,
  getStocksBySupplier,
  getStocksByMaterial,
  getAllStocks,
  getUserStocks,
  getStockById,
};
