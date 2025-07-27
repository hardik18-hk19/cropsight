import React, { useState } from "react";
import { imageAPI } from "../services/api";
import { toast } from "react-toastify";

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setSelectedImages(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSingleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      const response = await imageAPI.uploadImage(selectedImages[0]);
      if (response.success) {
        toast.success("Image uploaded successfully");
        setUploadedImages([...uploadedImages, response.imageUrl]);
        clearSelection();
      } else {
        toast.error("Upload failed: " + response.message);
      }
    } catch (error) {
      toast.error("Upload error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please select images first");
      return;
    }

    setIsUploading(true);
    try {
      const response = await imageAPI.uploadMultipleImages(selectedImages);
      if (response.success) {
        toast.success(`${selectedImages.length} images uploaded successfully`);
        setUploadedImages([...uploadedImages, ...response.imageUrls]);
        clearSelection();
      } else {
        toast.error("Upload failed: " + response.message);
      }
    } catch (error) {
      toast.error("Upload error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    // Extract public_id from cloudinary URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    try {
      const response = await imageAPI.deleteImage(publicId);
      if (response.success) {
        toast.success("Image deleted successfully");
        setUploadedImages(uploadedImages.filter((url) => url !== imageUrl));
      } else {
        toast.error("Delete failed: " + response.message);
      }
    } catch (error) {
      toast.error("Delete error: " + error.message);
    }
  };

  const clearSelection = () => {
    setSelectedImages([]);
    setPreviewUrls([]);
    // Reset file input
    const fileInput = document.getElementById("image-input");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Image Upload Management
      </h2>

      {/* Upload Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Upload Images</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images (Max 5)
          </label>
          <input
            id="image-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {selectedImages.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {selectedImages.length} image(s) selected
            </p>
          )}
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Preview:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSingleUpload}
            disabled={isUploading || selectedImages.length === 0}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Single"}
          </button>
          <button
            onClick={handleMultipleUpload}
            disabled={isUploading || selectedImages.length === 0}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Multiple"}
          </button>
          <button
            onClick={clearSelection}
            disabled={selectedImages.length === 0}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Uploaded Images Section */}
      {uploadedImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteImage(imageUrl)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-white bg-opacity-80 text-gray-800 text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No images uploaded yet
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
