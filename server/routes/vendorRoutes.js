import express from "express";
import {
  PredictPriceController,
  createVendorController,
  getAllVendorsController,
  getSingleVendorController,
  getMyVendorData,
  UpdateVendorController,
  DeleteVendorController,
  addPreferredMaterialController,
  deletePreferredMaterialIdController,
} from "../controllers/vendorController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

//price predict
router.post("/predict-price", PredictPriceController);

//create vendor
router.post("/create-vendor", createVendorController);

//get user's own vendor data
router.get("/my-data", userAuth, getMyVendorData);

//get vendors
router.get("/getall-vendors", getAllVendorsController);

//get-single vendors
router.get("/get-vendor/:id", getSingleVendorController);

//update vendor
router.put("/update-vendor/:id", UpdateVendorController);

//delete vendor
router.delete("/delete-vendor/:id", DeleteVendorController);

//preferred-material (requires authentication)
router.post(
  "/preferred-material/:id",
  userAuth,
  addPreferredMaterialController
);

//removepreferredMaterial (requires authentication)
router.delete(
  "/preferred-material/:id/:materialId",
  userAuth,
  deletePreferredMaterialIdController
);

export default router;
