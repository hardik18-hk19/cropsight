import express from "express";
import {
  PredictPriceController,
  createVendorController,
  getAllVendorsController,
  getSingleVendorController,
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

export default router;
