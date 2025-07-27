import React, { useState, useEffect } from "react";
import { vendorAPI, supplierAPI } from "../services/api";
import { toast } from "react-toastify";

const PreferredMaterialSelector = ({
  vendorId,
  currentPreferences = [],
  onUpdate,
}) => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] =
    useState(currentPreferences);

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  useEffect(() => {
    setSelectedMaterials(currentPreferences);
  }, [currentPreferences]);

  const fetchRawMaterials = async () => {
    try {
      const response = await supplierAPI.getAllRawMaterials();
      if (response.success) {
        setRawMaterials(response.rawMaterials);
      }
    } catch (error) {
      toast.error("Error fetching materials: " + error.message);
    }
  };

  const handleToggleMaterial = async (materialId) => {
    if (!vendorId) {
      toast.error("Vendor ID is required");
      return;
    }

    setIsLoading(true);
    try {
      const isCurrentlySelected = selectedMaterials.some(
        (m) => m._id === materialId
      );

      if (isCurrentlySelected) {
        // Remove from preferences
        const response = await vendorAPI.removePreferredMaterial(
          vendorId,
          materialId
        );
        if (response.success) {
          const updatedMaterials = selectedMaterials.filter(
            (m) => m._id !== materialId
          );
          setSelectedMaterials(updatedMaterials);
          onUpdate && onUpdate(updatedMaterials);
          toast.success("Material removed from preferences");
        }
      } else {
        // Add to preferences
        const response = await vendorAPI.addPreferredMaterial(
          vendorId,
          materialId
        );
        if (response.success) {
          const material = rawMaterials.find((m) => m._id === materialId);
          const updatedMaterials = [...selectedMaterials, material];
          setSelectedMaterials(updatedMaterials);
          onUpdate && onUpdate(updatedMaterials);
          toast.success("Material added to preferences");
        }
      }
    } catch (error) {
      toast.error("Error updating preferences: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSelected = (materialId) => {
    return selectedMaterials.some((m) => m._id === materialId);
  };

  return (
    <div className="preferred-materials-selector">
      {/* Current Preferences Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-md font-semibold text-gray-700">
            Preferred Materials
          </h4>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Manage Preferences
          </button>
        </div>

        {selectedMaterials.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedMaterials.map((material) => (
              <span
                key={material._id}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {material.name}
                <button
                  onClick={() => handleToggleMaterial(material._id)}
                  className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No preferred materials selected
          </p>
        )}
      </div>

      {/* Modal for Managing Preferences */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Manage Preferred Materials
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {rawMaterials.map((material) => (
                  <div
                    key={material._id}
                    className={`p-3 border rounded cursor-pointer transition-all ${
                      isSelected(material._id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleToggleMaterial(material._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-800">
                          {material.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {material.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          Unit: {material.unit}
                        </p>
                      </div>

                      <div
                        className={`w-4 h-4 rounded border-2 transition-all ${
                          isSelected(material._id)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected(material._id) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {selectedMaterials.length} of {rawMaterials.length} materials
                  selected
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default PreferredMaterialSelector;
