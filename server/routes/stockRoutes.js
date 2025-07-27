import express from "express";
import {
  addStock,
  updateStock,
  deleteStock,
  getStocksBySupplier,
  getStocksByMaterial,
  getAllStocks,
  getStockById,
} from "../controllers/stockController.js";
import upload from "../middleware/upload.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// Add new stock with images
router.post("/add", userAuth, upload.array("images", 5), addStock);

// Update stock with images
router.put(
  "/update/:stockId",
  userAuth,
  upload.array("images", 5),
  updateStock
);

// Delete stock
router.delete("/delete/:stockId", userAuth, deleteStock);

// Get stocks by supplier
router.get("/supplier/:supplierId", getStocksBySupplier);

// Get stocks by material
router.get("/material/:materialId", getStocksByMaterial);

// Get all stocks
router.get("/all", getAllStocks);

// Get stock by ID
router.get("/:stockId", getStockById);

export default router;
