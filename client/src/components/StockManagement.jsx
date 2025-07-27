import React, { useState, useEffect } from "react";
import { stockAPI, supplierAPI } from "../services/api";
import { toast } from "react-toastify";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({
    supplierId: "",
    materialId: "",
    quantity: "",
    price: "",
    description: "",
    location: {
      city: "",
      state: "",
      pincode: "",
    },
    harvestDate: "",
    expiryDate: "",
    qualityGrade: "A",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    fetchStocks();
    fetchSuppliers();
    fetchRawMaterials();
  }, []);

  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      // Fetch user's own stocks instead of all stocks
      const response = await stockAPI.getUserStocks();
      if (response.success) {
        setStocks(response.stocks);
      } else {
        toast.error("Failed to fetch your stocks");
      }
    } catch (error) {
      toast.error("Error fetching your stocks: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      // Fetch only the user's own supplier data instead of all suppliers
      const response = await supplierAPI.getMySupplierData();
      if (response.success) {
        setSuppliers([response.supplier]); // Set as array with single supplier
      }
    } catch (error) {
      toast.error("Error fetching your supplier data: " + error.message);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const response = await supplierAPI.getAllRawMaterials();
      if (response.success) {
        setRawMaterials(response.rawMaterials || []);
      } else {
        toast.error("Failed to fetch raw materials");
      }
    } catch (error) {
      toast.error("Error fetching raw materials: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (editingStock) {
        response = await stockAPI.updateStock(
          editingStock._id,
          formData,
          selectedImages
        );
      } else {
        response = await stockAPI.addStock(formData, selectedImages);
      }

      if (response.success) {
        toast.success(response.message);
        resetForm();
        fetchStocks();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          error.response?.data?.message ||
            "Access denied. You can only manage your own stocks."
        );
      } else if (error.response?.status === 401) {
        toast.error("Please login to manage stocks.");
      } else if (error.response?.status === 404) {
        toast.error(error.response?.data?.message || "Resource not found.");
      } else {
        toast.error("Error saving stock: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (stockId) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      try {
        const response = await stockAPI.deleteStock(stockId);
        if (response.success) {
          toast.success("Stock deleted successfully");
          fetchStocks();
        } else {
          toast.error("Failed to delete stock");
        }
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error("Access denied. You can only delete your own stocks.");
        } else if (error.response?.status === 401) {
          toast.error("Please login to manage stocks.");
        } else {
          toast.error("Error deleting stock: " + error.message);
        }
      }
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setFormData({
      supplierId: stock.supplierId._id || stock.supplierId,
      materialId: stock.materialId._id || stock.materialId,
      quantity: stock.quantity,
      price: stock.price,
      description: stock.description || "",
      location: {
        city: stock.location?.city || "",
        state: stock.location?.state || "",
        pincode: stock.location?.pincode || "",
      },
      harvestDate: stock.harvestDate ? stock.harvestDate.split("T")[0] : "",
      expiryDate: stock.expiryDate ? stock.expiryDate.split("T")[0] : "",
      qualityGrade: stock.qualityGrade || "A",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      supplierId: "",
      materialId: "",
      quantity: "",
      price: "",
      description: "",
      location: {
        city: "",
        state: "",
        pincode: "",
      },
      harvestDate: "",
      expiryDate: "",
      qualityGrade: "A",
    });
    setSelectedImages([]);
    setEditingStock(null);
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
          My Stock Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? "Cancel" : "Add New Stock"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-gray-50 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingStock ? "Edit Stock" : "Add New Stock"}
          </h3>

          {suppliers.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Supplier Profile Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You need to create a supplier profile before you can add
                      stocks. Please set up your supplier profile first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Supplier Profile
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) =>
                  setFormData({ ...formData, supplierId: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Your Supplier Profile</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.userId?.name || "Your Supplier Profile"}
                  </option>
                ))}
              </select>
              {suppliers.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  You need to create a supplier profile first to add stocks.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raw Material
              </label>
              <select
                value={formData.materialId}
                onChange={(e) =>
                  setFormData({ ...formData, materialId: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Raw Material</option>
                {rawMaterials.map((material) => (
                  <option key={material._id} value={material._id}>
                    {material.name} ({material.unit}) - {material.category}
                  </option>
                ))}
              </select>
              {rawMaterials.length === 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Loading available materials...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                value={formData.location.pincode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, pincode: e.target.value },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harvest Date
              </label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) =>
                  setFormData({ ...formData, harvestDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Grade
              </label>
              <select
                value={formData.qualityGrade}
                onChange={(e) =>
                  setFormData({ ...formData, qualityGrade: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
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
              disabled={isLoading || suppliers.length === 0}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Saving..."
                : editingStock
                ? "Update Stock"
                : "Add Stock"}
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
                Supplier
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Material
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
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
                  colSpan="6"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  No stocks found. Add your first stock to get started!
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {stock.supplierId?.userId?.name ||
                      stock.supplierId?.name ||
                      "Unknown Supplier"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {stock.materialId?.name
                      ? `${stock.materialId.name} (${stock.materialId.unit})`
                      : stock.materialId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {stock.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${stock.price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {stock.description || "No description"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(stock)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(stock._id)}
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

export default StockManagement;
