import React, { useState, useEffect } from "react";
import { supplierAPI, stockAPI } from "../services/api";
import { toast } from "react-toastify";
import Breadcrumb from "./Breadcrumb";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierStocks, setSupplierStocks] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await supplierAPI.getAllSuppliers();
      if (response.success) {
        setSuppliers(response.suppliers);
      } else {
        toast.error("Failed to fetch suppliers");
      }
    } catch (error) {
      toast.error("Error fetching suppliers: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewSupplierDetails = async (supplierId) => {
    try {
      // Fetch supplier details
      const supplierResponse = await supplierAPI.getSupplierById(supplierId);
      if (supplierResponse.success) {
        setSelectedSupplier(supplierResponse.supplier);

        // Fetch stocks for this supplier
        const stocksResponse = await stockAPI.getStocksBySupplier(supplierId);
        if (stocksResponse.success) {
          setSupplierStocks(stocksResponse.stocks);
        } else {
          setSupplierStocks([]);
        }

        setShowDetails(true);
      } else {
        toast.error("Failed to fetch supplier details");
      }
    } catch (error) {
      toast.error("Error fetching supplier details: " + error.message);
    }
  };

  const closeDetails = () => {
    setSelectedSupplier(null);
    setSupplierStocks([]);
    setShowDetails(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Breadcrumb items={[{ name: "Suppliers", path: null }]} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Supplier Management
        </h2>
        <button
          onClick={fetchSuppliers}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Suppliers List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Supplier Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Raw Materials Count
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
                  colSpan="4"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 px-4 py-8 text-center"
                >
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {supplier.userId?.name || "Unknown Supplier"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.userId?.email || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.rawMaterials?.length || 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => viewSupplierDetails(supplier._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Supplier Details Modal */}
      {showDetails && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Supplier Details
                </h3>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Supplier Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">
                  Supplier Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name:
                    </label>
                    <p className="text-gray-800">
                      {selectedSupplier.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email:
                    </label>
                    <p className="text-gray-800">
                      {selectedSupplier.userId?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Supplier ID:
                    </label>
                    <p className="text-gray-800 font-mono text-sm">
                      {selectedSupplier._id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Total Materials:
                    </label>
                    <p className="text-gray-800">
                      {selectedSupplier.rawMaterials?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Raw Materials */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Raw Materials</h4>
                {selectedSupplier.rawMaterials &&
                selectedSupplier.rawMaterials.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Material Name
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Category
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Unit
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Price
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Quantity
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left">
                            Availability
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSupplier.rawMaterials.map(
                          (material, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">
                                {material.materialId?.name || "N/A"}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {material.materialId?.category || "N/A"}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {material.materialId?.unit || "N/A"}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                ${material.price || "0.00"}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {material.quantity || 0}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    material.availability
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {material.availability
                                    ? "Available"
                                    : "Unavailable"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No raw materials found for this supplier
                  </p>
                )}
              </div>

              {/* Stock Images and Details */}
              <div>
                <h4 className="text-lg font-semibold mb-3">
                  Stock Portfolio & Images
                </h4>
                {supplierStocks && supplierStocks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supplierStocks.map((stock) => (
                      <div
                        key={stock._id}
                        className="bg-gray-50 rounded-lg p-4 shadow-sm"
                      >
                        {/* Stock Images */}
                        {stock.images && stock.images.length > 0 && (
                          <div className="mb-3">
                            <div className="grid grid-cols-2 gap-2">
                              {stock.images
                                .slice(0, 4)
                                .map((image, imgIndex) => (
                                  <img
                                    key={imgIndex}
                                    src={image.url || image}
                                    alt={`Stock ${
                                      stock.materialId?.name || "item"
                                    }`}
                                    className="w-full h-20 object-cover rounded"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ))}
                            </div>
                            {stock.images.length > 4 && (
                              <p className="text-xs text-gray-500 mt-1 text-center">
                                +{stock.images.length - 4} more images
                              </p>
                            )}
                          </div>
                        )}

                        {/* Stock Details */}
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-800">
                            {stock.materialId?.name || stock.materialId}
                          </h5>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <strong>Quantity:</strong> {stock.quantity} units
                            </p>
                            <p>
                              <strong>Price:</strong> $
                              {stock.pricePerUnit || stock.price}/unit
                            </p>

                            {stock.qualityGrade && (
                              <p>
                                <strong>Quality:</strong>
                                <span
                                  className={`ml-1 px-2 py-1 rounded text-xs ${
                                    stock.qualityGrade === "Premium"
                                      ? "bg-purple-100 text-purple-800"
                                      : stock.qualityGrade === "A"
                                      ? "bg-green-100 text-green-800"
                                      : stock.qualityGrade === "B"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {stock.qualityGrade}
                                </span>
                              </p>
                            )}

                            {stock.location && (
                              <p>
                                <strong>Location:</strong> {stock.location.city}
                                , {stock.location.state}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  stock.availability
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {stock.availability
                                  ? "Available"
                                  : "Unavailable"}
                              </span>

                              {stock.timestamp && (
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    stock.timestamp
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {stock.description && (
                              <p className="text-xs text-gray-600 mt-2 p-2 bg-white rounded border-l-2 border-blue-200">
                                {stock.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No stocks found for this supplier
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

export default SupplierManagement;
