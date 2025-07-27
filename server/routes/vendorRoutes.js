import express from "express";
import { PredictPriceController } from "../controllers/vendorController.js";

const router = express.Router();

//price predict

router.post("/predict-price", PredictPriceController);

export default router;
