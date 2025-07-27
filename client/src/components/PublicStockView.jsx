import React, { useState, useEffect } from "react";
import { stockAPI } from "../services/api";
import { toast } from "react-toastify";

const PublicStockView = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    fetchAllStocks();
  }, []);

  const fetchAllStocks = async () => {
    setIsLoading(true);
    try {
      const response = await stockAPI.getAllStocks();
      if (response.success) {
        setStocks(response.stocks);
      } else {
        toast.error("Failed to fetch stocks");
      }
    } catch (error) {
      toast.error("Error fetching stocks: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.materialId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      stock.supplierId?.id?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      stock.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterBy === "all") return matchesSearch;
    if (filterBy === "available") return matchesSearch && stock.availability;
    if (filterBy === "unavailable") return matchesSearch && !stock.availability;

    return matchesSearch;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Browse Available Stocks
        </h2>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by material, supplier, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Stocks</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading stocks...</p>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">
              {searchTerm
                ? "No stocks found matching your search."
                : "No stocks available."}
            </p>
          </div>
        ) : (
          filteredStocks.map((stock) => (
            <div
              key={stock._id}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stock Images */}
              {stock.images && stock.images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={stock.images[0].url || stock.images[0]}
                    alt={stock.materialId?.name || "Stock item"}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Stock Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {stock.materialId?.name || stock.materialId}
                </h3>

                <p className="text-sm text-gray-600">
                  <strong>Supplier:</strong>{" "}
                  {stock.supplierId?.id?.name || "Unknown Supplier"}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Quantity:</strong> {stock.quantity} units
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Price:</strong> ${stock.pricePerUnit || stock.price}
                  /unit
                </p>

                {stock.qualityGrade && (
                  <p className="text-sm text-gray-600">
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
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {stock.location.city},{" "}
                    {stock.location.state}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      stock.availability
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {stock.availability ? "Available" : "Unavailable"}
                  </span>

                  {stock.userId?.name && (
                    <span className="text-xs text-gray-500">
                      by {stock.userId.name}
                    </span>
                  )}
                </div>

                {stock.description && (
                  <p className="text-sm text-gray-600 mt-3 p-2 bg-white rounded border-l-4 border-blue-200">
                    {stock.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Summary */}
      {!isLoading && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredStocks.length} of {stocks.length} stocks
        </div>
      )}
    </div>
  );
};

export default PublicStockView;
