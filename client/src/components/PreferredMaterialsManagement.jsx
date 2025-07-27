import React, { useState, useEffect } from "react";
import { vendorAPI, supplierAPI } from "../services/api";
import { toast } from "react-toastify";

const PreferredMaterialsManagement = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [preferredMaterials, setPreferredMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch all raw materials
      const materialsResponse = await supplierAPI.getAllRawMaterials();
      if (materialsResponse.success) {
        setRawMaterials(materialsResponse.rawMaterials);
      }

      // Fetch user's own vendor data instead of allowing access to any vendor
      const vendorResponse = await vendorAPI.getVendorData();
      if (vendorResponse.success) {
        setVendorData(vendorResponse.vendor);
        setPreferredMaterials(vendorResponse.vendor.preferredMaterials || []);
      }
    } catch (error) {
      toast.error("Error fetching data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPreferred = async (materialId) => {
    if (!vendorData) {
      toast.error("Please create a vendor profile first");
      return;
    }

    try {
      const response = await vendorAPI.addPreferredMaterial(
        vendorData._id,
        materialId
      );
      if (response.success) {
        toast.success("Material added to preferences");
        // Update local state
        const material = rawMaterials.find((m) => m._id === materialId);
        setPreferredMaterials([...preferredMaterials, material]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          "Access denied. You can only manage your own preferred materials."
        );
      } else if (error.response?.status === 401) {
        toast.error("Please login to manage preferred materials.");
      } else {
        toast.error("Error adding preferred material: " + error.message);
      }
    }
  };

  const handleRemovePreferred = async (materialId) => {
    if (!vendorData) return;

    try {
      const response = await vendorAPI.removePreferredMaterial(
        vendorData._id,
        materialId
      );
      if (response.success) {
        toast.success("Material removed from preferences");
        // Update local state
        setPreferredMaterials(
          preferredMaterials.filter((m) => m._id !== materialId)
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          "Access denied. You can only manage your own preferred materials."
        );
      } else if (error.response?.status === 401) {
        toast.error("Please login to manage preferred materials.");
      } else {
        toast.error("Error removing preferred material: " + error.message);
      }
    }
  };

  const isPreferred = (materialId) => {
    return preferredMaterials.some((m) => m._id === materialId);
  };

  const filteredMaterials = rawMaterials.filter((material) => {
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(rawMaterials.map((m) => m.category))];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Preferred Materials Management
        </h2>
        <p className="text-gray-600">
          Select materials you prefer to work with. This will help in filtering
          and recommendations.
        </p>
      </div>

      {/* Current Preferred Materials */}
      {preferredMaterials.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Your Preferred Materials ({preferredMaterials.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {preferredMaterials.map((material) => (
              <div
                key={material._id}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>
                  {material.name} ({material.category})
                </span>
                <button
                  onClick={() => handleRemovePreferred(material._id)}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading materials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaterials.map((material) => (
            <div
              key={material._id}
              className={`p-4 border rounded-lg transition-all ${
                isPreferred(material._id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {material.name}
                  </h4>
                  <p className="text-sm text-gray-600">{material.category}</p>
                  <p className="text-xs text-gray-500">Unit: {material.unit}</p>
                </div>

                <button
                  onClick={() =>
                    isPreferred(material._id)
                      ? handleRemovePreferred(material._id)
                      : handleAddPreferred(material._id)
                  }
                  className={`ml-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isPreferred(material._id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isPreferred(material._id) ? "Remove" : "Add"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredMaterials.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== "all"
              ? "No materials found matching your criteria."
              : "No materials available."}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("all");
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear Filters
        </button>

        <button
          onClick={fetchInitialData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {rawMaterials.length}
            </div>
            <div className="text-sm text-gray-600">Total Materials</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {preferredMaterials.length}
            </div>
            <div className="text-sm text-gray-600">Preferred</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {preferredMaterials.length > 0
                ? Math.round(
                    (preferredMaterials.length / rawMaterials.length) * 100
                  )
                : 0}
              %
            </div>
            <div className="text-sm text-gray-600">Coverage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferredMaterialsManagement;
