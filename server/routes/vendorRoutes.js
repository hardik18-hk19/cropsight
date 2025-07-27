import express from "express";
import {
  PredictPriceController,
  createVendorController,
  getAllVendorsController,
  getSingleVendorController,
  UpdateVendorController,
  DeleteVendorController,
  addPreferredMaterialController,
  deletePreferredMaterialIdController,
} from "../controllers/vendorController.js";

const router = express.Router();

//price predict

router.post("/predict-price", PredictPriceController);

//create vendor
router.post("/create-vendor", createVendorController);

//get vendors
router.get("/getall-vendors", getAllVendorsController);

//get-single vendors
router.get("/get-vendor/:id", getSingleVendorController);

//update vendor
router.put("/update-vendor/:id", UpdateVendorController);

//delete vendor
router.delete("/delete-vendor/:id", DeleteVendorController);

//preferred-material
router.post("/preferred-material/:id", addPreferredMaterialController);

//removepreferredMaterial
router.delete(
  "/preferred-material/:id/:materialId",
  deletePreferredMaterialIdController
);

export default router;
