import express from "express";
import {
  getAllSuppliers,
  getSupplierById,
  addRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from "../controllers/supplierController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/get-suppliers", getAllSuppliers);
router.get("/get-supplier/:id", getSupplierById);
router.post("/add-material", upload.array("images", 5), addRawMaterial);
router.put(
  "/update-material/:materialId",
  upload.array("images", 5),
  updateRawMaterial
);
router.delete("/delete-material/:materialId", deleteRawMaterial);

export default router;
