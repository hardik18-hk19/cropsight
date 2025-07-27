import express from "express";
import {
  PredictPriceController,
  createVendorController,
  getAllVendorsController,
  getSingleVendorController,
  UpdateVendorController,
  DeleteVendorController,
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

export default router;
