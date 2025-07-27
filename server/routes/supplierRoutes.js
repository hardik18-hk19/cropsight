import express from "express";
import {
  getAllSuppliers,
  getSupplierById,
  getMySupplierData,
  getAllRawMaterials,
  addRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from "../controllers/supplierController.js";
import upload from "../middleware/upload.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/get-suppliers", getAllSuppliers);
router.get("/get-supplier/:id", getSupplierById);
router.get("/my-data", userAuth, getMySupplierData);
router.get("/raw-materials", getAllRawMaterials);
router.post(
  "/add-material",
  userAuth,
  upload.array("images", 5),
  addRawMaterial
);
router.put(
  "/update-material/:materialId",
  userAuth,
  upload.array("images", 5),
  updateRawMaterial
);
router.delete("/delete-material/:materialId", userAuth, deleteRawMaterial);

export default router;
