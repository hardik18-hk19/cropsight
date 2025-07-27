import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl, setUserData, setIsLoggedIn, userRole } =
    useContext(AppContent);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: "🏠",
      public: true,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      protected: true,
    },
  ];

  const dashboardItems = [
    {
      name: "Overview",
      section: "overview",
      icon: "📊",
      description: "Dashboard overview and statistics",
    },
    {
      name: "Suppliers",
      section: "suppliers",
      icon: "🏢",
      description: "Manage supplier information",
    },
    {
      name: "Vendors",
      section: "vendors",
      icon: "🛒",
      description: "Manage vendor relationships",
    },
    {
      name: "Stock Management",
      section: "stocks",
      icon: "📦",
      description: "Track and manage inventory",
    },
    {
      name: "Raw Materials",
      section: "materials",
      icon: "🌾",
      description: "Manage raw material data",
    },
    {
      name: "Image Upload",
      section: "images",
      icon: "🖼️",
      description: "Upload and manage images",
    },
  ];

  const isActive = (path) => location.pathname === path;
  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={assets.logo}
                alt="CropSight Logo"
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
              <span className="ml-2 text-xl font-bold text-gray-800 hidden sm:block">
                CropSight
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                if (item.protected && !userData) return null;
                if (item.public || userData) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                }
                return null;
              })}
            </div>

            {/* User Account Section */}
            <div className="flex items-center space-x-4">
              {userData ? (
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {userData.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{userData.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {userRole}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="p-4 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {userData.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userData.email}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            userData.isAccountVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {userData.isAccountVerified
                            ? "✓ Verified"
                            : "⚠ Unverified"}
                        </span>
                      </div>

                      <div className="py-2">
                        {userData && !userData.isAccountVerified && (
                          <button
                            onClick={sendVerificationOtp}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <span>📧</span>
                            <span>Verify Email</span>
                          </button>
                        )}

                        <button
                          onClick={() => navigate("/dashboard")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span>📊</span>
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => navigate("/reset-password")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <span>🔒</span>
                          <span>Change Password</span>
                        </button>

                        <hr className="my-2" />

                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <span>🚪</span>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span>Login</span>
                  <img
                    src={assets.arrow_icon}
                    alt="Arrow"
                    className="w-4 h-4"
                  />
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  if (item.protected && !userData) return null;
                  if (item.public || userData) {
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Sub-Navigation */}
      {isDashboard && userData && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto py-2">
              {dashboardItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    // This will be handled by the Dashboard component's state
                    window.dispatchEvent(
                      new CustomEvent("dashboardTabChange", {
                        detail: item.section,
                      })
                    );
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                  title={item.description}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler for dropdowns */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navigation;
