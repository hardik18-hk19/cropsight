import React, { useState, useContext, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import StockManagement from "../components/StockManagement";
import RawMaterialManagement from "../components/RawMaterialManagement";
import ImageUpload from "../components/ImageUpload";
import SupplierManagement from "../components/SupplierManagement";
import VendorManagement from "../components/VendorManagement";

const Dashboard = () => {
  const { userData, userRole } = useContext(AppContent);
  const [activeTab, setActiveTab] = useState("overview");

  // Listen for navigation events from the Navigation component
  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener("dashboardTabChange", handleTabChange);
    return () =>
      window.removeEventListener("dashboardTabChange", handleTabChange);
  }, []);

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "suppliers", name: "Suppliers", icon: "🏢" },
    { id: "vendors", name: "Vendors", icon: "🛒" },
    { id: "stocks", name: "Stock Management", icon: "📦" },
    { id: "materials", name: "Raw Materials", icon: "🌾" },
    { id: "images", name: "Image Upload", icon: "🖼️" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                CropSight Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {userData?.name || "User"}! Manage your
                agricultural operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🏢</div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Suppliers
                    </h3>
                    <p className="text-blue-600">Manage supplier information</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🛒</div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800">
                      Vendors
                    </h3>
                    <p className="text-orange-600">Manage vendor profiles</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📦</div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Stock Management
                    </h3>
                    <p className="text-green-600">Manage inventory stocks</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🌾</div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Raw Materials
                    </h3>
                    <p className="text-yellow-600">
                      Manage raw material catalog
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🖼️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800">
                      Image Upload
                    </h3>
                    <p className="text-purple-600">Upload and manage images</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Name:
                  </label>
                  <p className="text-gray-800">
                    {userData?.name || "Not available"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email:
                  </label>
                  <p className="text-gray-800">
                    {userData?.email || "Not available"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Role:
                  </label>
                  <p className="text-gray-800 capitalize">
                    {userRole || "Not available"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status:
                  </label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case "suppliers":
        return <SupplierManagement />;
      case "vendors":
        return <VendorManagement />;
      case "stocks":
        return <StockManagement />;
      case "materials":
        return <RawMaterialManagement />;
      case "images":
        return <ImageUpload />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="bg-gray-100 pt-16">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
