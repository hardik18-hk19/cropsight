import React, { useState, useEffect } from "react";
import { supplierAPI } from "../services/api";
import { toast } from "react-toastify";

const RawMaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPreferenceForm, setShowPreferenceForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    category: "",
  });

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
    fetchAllMaterials();
  }, []);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const response = await supplierAPI.getMySupplierData();
      if (response.success && response.supplier) {
        // Extract raw materials from the current user's supplier data
        const myMaterials = response.supplier.rawMaterials.map((material) => ({
          ...material.materialId,
          supplierId: response.supplier._id,
          supplierName: response.supplier.userId?.name || "Your Materials",
          _id: material.materialId._id, // Use materialId for operations
        }));
        setMaterials(myMaterials);
      } else {
        setMaterials([]);
      }
    } catch (error) {
      toast.error("Error fetching materials: " + error.message);
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/supplier/all-materials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAllMaterials(data.data);
      }
    } catch (error) {
      console.error("Error fetching all materials:", error);
    }
  };

  const handleAddPreference = async (materialId) => {
    try {
      setIsLoading(true);
      const response = await supplierAPI.addMaterialPreference(materialId);
      if (response.success) {
        toast.success("Material added to your preferences!");
        fetchMaterials(); // Refresh the materials list
        fetchAllMaterials(); // Refresh all materials to update availability
      } else {
        toast.error(response.message || "Failed to add material preference");
      }
    } catch (error) {
      toast.error("Error adding material preference: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for duplicate material names (case-insensitive)
      const existingMaterial = materials.find(
        (material) =>
          material.name.toLowerCase() === formData.name.toLowerCase() &&
          (!editingMaterial || material._id !== editingMaterial._id)
      );

      if (existingMaterial) {
        toast.error(
          `Material "${formData.name}" already exists in your inventory`
        );
        setIsLoading(false);
        return;
      }

      let response;
      if (editingMaterial) {
        response = await supplierAPI.updateRawMaterial(
          editingMaterial._id,
          formData
        );
      } else {
        response = await supplierAPI.addRawMaterial(formData);
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
    setEditingMaterial(null);
    setShowForm(false);
  };

  const togglePreferenceForm = () => {
    setShowPreferenceForm(!showPreferenceForm);
    if (!showPreferenceForm) {
      fetchAllMaterials(); // Refresh all materials when opening preference form
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Raw Material Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showForm ? "Cancel" : "Add New Material"}
          </button>
          <button
            onClick={togglePreferenceForm}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            {showPreferenceForm ? "Cancel" : "Browse Materials"}
          </button>
        </div>
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

      {showPreferenceForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Browse All Available Materials
          </h3>
          <p className="text-gray-600 mb-4">
            Add existing materials to your preferences instead of creating
            duplicates.
          </p>

          {isLoading ? (
            <div className="text-center py-4">Loading materials...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allMaterials
                .filter(
                  (material) =>
                    !materials.some(
                      (myMaterial) => myMaterial._id === material._id
                    )
                )
                .map((material) => (
                  <div
                    key={material._id}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <h4 className="font-semibold text-lg text-gray-800">
                      {material.name}
                    </h4>
                    <p className="text-gray-600">Unit: {material.unit}</p>
                    <p className="text-gray-600">
                      Category: {material.category}
                    </p>
                    <button
                      onClick={() => handleAddPreference(material._id)}
                      disabled={isLoading}
                      className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 w-full"
                    >
                      Add to My Materials
                    </button>
                  </div>
                ))}
              {allMaterials.filter(
                (material) =>
                  !materials.some(
                    (myMaterial) => myMaterial._id === material._id
                  )
              ).length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No new materials available to add. You have access to all
                  existing materials.
                </div>
              )}
            </div>
          )}
        </div>
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
            ) : materials.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
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
