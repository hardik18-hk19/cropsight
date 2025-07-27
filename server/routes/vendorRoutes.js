import express from "express";
import {
  PredictPriceController,
  getAllVendorsController,
} from "../controllers/vendorController.js";

const router = express.Router();

//price predict

router.post("/predict-price", PredictPriceController);

//get vendors
router.get("/getall-vendors", getAllVendorsController);

export default router;
