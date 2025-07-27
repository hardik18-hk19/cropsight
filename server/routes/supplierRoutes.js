import express from "express";
import {
  getAllSuppliers,
  getSupplierById,
} from "../controllers/supplierController";

const router = express.Router();

router.get("/get-suppliers", getAllSuppliers);
router.get("/get-supplier/:id", getSupplierById);

export default router;
