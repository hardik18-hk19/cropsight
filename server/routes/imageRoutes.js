import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImageDetails,
} from "../controllers/imageController.js";

const router = express.Router();

// Upload single image
router.post("/upload", upload.single("image"), uploadImage);

// Upload multiple images (max 5)
router.post(
  "/upload-multiple",
  upload.array("images", 5),
  uploadMultipleImages
);

// Delete image
router.delete("/delete/:public_id", deleteImage);

// Get image details
router.get("/details/:public_id", getImageDetails);

export default router;
