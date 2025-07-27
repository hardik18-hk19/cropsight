import React, { useState, useEffect } from "react";
import { supplierAPI } from "../services/api";
import { toast } from "react-toastify";

const RawMaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    category: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const unitOptions = [
    "kg",
    "g",
    "dozen",
    "litre",
    "ml",
    "piece",
    "bundle",
    "box",
    "packet",
    "tray",
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const response = await supplierAPI.getAllSuppliers();
      if (response.success) {
        // Extract all raw materials from suppliers
        const allMaterials = [];
        response.suppliers.forEach((supplier) => {
          if (supplier.rawMaterials) {
            supplier.rawMaterials.forEach((material) => {
              if (material.materialId) {
                allMaterials.push({
                  ...material.materialId,
                  supplierId: supplier._id,
                  supplierName: supplier.id?.name || "Unknown Supplier",
                  price: material.price,
                  availability: material.availability,
                  quantity: material.quantity,
                  description: material.description,
                });
              }
            });
          }
        });
        setMaterials(allMaterials);
      } else {
        toast.error("Failed to fetch materials");
      }
    } catch (error) {
      toast.error("Error fetching materials: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (editingMaterial) {
        response = await supplierAPI.updateRawMaterial(
          editingMaterial._id,
          formData,
          selectedImages
        );
      } else {
        response = await supplierAPI.addRawMaterial(formData, selectedImages);
      }

      if (response.success) {
        toast.success(response.message);
        resetForm();
        fetchMaterials();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error saving material: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (window.confirm("Are you sure you want to delete this raw material?")) {
      try {
        const response = await supplierAPI.deleteRawMaterial(materialId);
        if (response.success) {
          toast.success("Raw material deleted successfully");
          fetchMaterials();
        } else {
          toast.error("Failed to delete raw material");
        }
      } catch (error) {
        toast.error("Error deleting material: " + error.message);
      }
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      unit: material.unit,
      category: material.category,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      unit: "",
      category: "",
    });
    setSelectedImages([]);
    setEditingMaterial(null);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setSelectedImages(files);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Raw Material Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? "Cancel" : "Add New Material"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-gray-50 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingMaterial ? "Edit Raw Material" : "Add New Raw Material"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter material name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Unit</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter category"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Max 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {selectedImages.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedImages.length} image(s) selected
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : editingMaterial
                ? "Update Material"
                : "Add Material"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Unit
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Supplier
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Availability
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : materials.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  No raw materials found
                </td>
              </tr>
            ) : (
              materials.map((material) => (
                <tr key={material._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {material.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.unit}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.supplierName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {material.price ? `$${material.price}` : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        material.availability
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {material.availability ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawMaterialManagement;
