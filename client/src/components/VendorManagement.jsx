import React, { useState, useEffect } from "react";
import { vendorAPI } from "../services/api";
import { toast } from "react-toastify";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    preferredMaterials: [],
  });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await vendorAPI.getAllVendors();
      if (response.success) {
        setVendors(response.vendors);
      } else {
        toast.error("Failed to fetch vendors");
      }
    } catch (error) {
      toast.error("Error fetching vendors: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (editingVendor) {
        response = await vendorAPI.updateVendor(editingVendor._id, formData);
      } else {
        response = await vendorAPI.createVendor(formData);
      }

      if (response.success) {
        toast.success(response.message);
        resetForm();
        fetchVendors();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error saving vendor: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const response = await vendorAPI.deleteVendor(vendorId);
        if (response.success) {
          toast.success("Vendor deleted successfully");
          fetchVendors();
        } else {
          toast.error("Failed to delete vendor");
        }
      } catch (error) {
        toast.error("Error deleting vendor: " + error.message);
      }
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      userId: vendor.userId?._id || vendor.userId,
      preferredMaterials:
        vendor.preferredMaterials?.map(
          (material) => material._id || material
        ) || [],
    });
    setShowForm(true);
  };

  const viewVendorDetails = async (vendorId) => {
    try {
      const response = await vendorAPI.getVendorById(vendorId);
      if (response.success) {
        setSelectedVendor(response.vendor);
        setShowDetails(true);
      } else {
        toast.error("Failed to fetch vendor details");
      }
    } catch (error) {
      toast.error("Error fetching vendor details: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      preferredMaterials: [],
    });
    setEditingVendor(null);
    setShowForm(false);
  };

  const closeDetails = () => {
    setSelectedVendor(null);
    setShowDetails(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vendor Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showForm ? "Cancel" : "Add New Vendor"}
          </button>
          <button
            onClick={fetchVendors}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-gray-50 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingVendor ? "Edit Vendor" : "Add New Vendor"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter user ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Materials (comma-separated IDs)
              </label>
              <input
                type="text"
                value={formData.preferredMaterials.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredMaterials: e.target.value
                      .split(",")
                      .map((id) => id.trim())
                      .filter((id) => id),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter material IDs separated by commas"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : editingVendor
                ? "Update Vendor"
                : "Add Vendor"}
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

      {/* Vendors List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Vendor Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Preferred Materials Count
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Created At
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
                  colSpan="5"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  No vendors found
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {vendor.userId?.name || "Unknown Vendor"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {vendor.userId?.email || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {vendor.preferredMaterials?.length || 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewVendorDetails(vendor._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vendor._id)}
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

      {/* Vendor Details Modal */}
      {showDetails && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Vendor Details
                </h3>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Vendor Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">
                  Vendor Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name:
                    </label>
                    <p className="text-gray-800">
                      {selectedVendor.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email:
                    </label>
                    <p className="text-gray-800">
                      {selectedVendor.userId?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Vendor ID:
                    </label>
                    <p className="text-gray-800 font-mono text-sm">
                      {selectedVendor._id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created:
                    </label>
                    <p className="text-gray-800">
                      {new Date(selectedVendor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferred Materials */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Preferred Materials
                </h4>
                {selectedVendor.preferredMaterials &&
                selectedVendor.preferredMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedVendor.preferredMaterials.map(
                      (material, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border"
                        >
                          <h5 className="font-medium text-gray-800">
                            {material?.name || material}
                          </h5>
                          {material?.category && (
                            <p className="text-sm text-gray-600">
                              Category: {material.category}
                            </p>
                          )}
                          {material?.unit && (
                            <p className="text-sm text-gray-600">
                              Unit: {material.unit}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No preferred materials set
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetails}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
