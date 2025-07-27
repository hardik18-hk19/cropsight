import express from "express";
import {
  addStock,
  updateStock,
  deleteStock,
  getStocksBySupplier,
  getStocksByMaterial,
  getAllStocks,
  getUserStocks,
  getStockById,
} from "../controllers/stockController.js";
import upload from "../middleware/upload.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// Add new stock with images (requires authentication)
router.post("/add", userAuth, upload.array("images", 5), addStock);

// Update stock with images (requires authentication)
router.put(
  "/update/:stockId",
  userAuth,
  upload.array("images", 5),
  updateStock
);

// Delete stock (requires authentication)
router.delete("/delete/:stockId", userAuth, deleteStock);

// Get user's own stocks (requires authentication)
router.get("/my-stocks", userAuth, getUserStocks);

// Get stocks by supplier (public access)
router.get("/supplier/:supplierId", getStocksBySupplier);

// Get stocks by material (public access)
router.get("/material/:materialId", getStocksByMaterial);

// Get all stocks (public access for browsing)
router.get("/all", getAllStocks);

// Get stock by ID (public access) - MUST be last among GET routes
router.get("/:stockId", getStockById);

export default router;
