import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "https://cropsight-kdpv.onrender.com";

// Helper function to construct URLs properly
const constructURL = (path) => {
  const base = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${base}${endpoint}`;
};

// Configure axios defaults
axios.defaults.withCredentials = true;

// Debug function to test URL construction
export const testURL = () => {
  const testUrl = constructURL("/api/auth/register");
  console.log("🔧 Constructed URL:", testUrl);
  return testUrl;
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await axios.post(
      constructURL("/api/auth/register"),
      userData
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(
      constructURL("/api/auth/login"),
      credentials
    );
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(constructURL("/api/auth/logout"));
    return response.data;
  },

  sendVerifyOtp: async () => {
    const response = await axios.post(
      constructURL("/api/auth/send-verify-otp")
    );
    return response.data;
  },

  verifyAccount: async (otp) => {
    const response = await axios.post(
      constructURL("/api/auth/verify-account"),
      {
        otp,
      }
    );
    return response.data;
  },

  sendResetOtp: async () => {
    const response = await axios.post(constructURL("/api/auth/send-reset-otp"));
    return response.data;
  },

  resetPassword: async (otpData) => {
    const response = await axios.post(
      constructURL("/api/auth/password-reset"),
      otpData
    );
    return response.data;
  },

  isAuthenticated: async () => {
    const response = await axios.get(constructURL("/api/auth/is-auth"));
    return response.data;
  },
};

// User API
export const userAPI = {
  getUserData: async () => {
    const response = await axios.get(constructURL("/api/user/data"));
    return response.data;
  },

  getUserRole: async () => {
    const response = await axios.get(constructURL("/api/user/role"));
    return response.data;
  },
};

// Supplier API
export const supplierAPI = {
  getAllSuppliers: async () => {
    const response = await axios.get(
      constructURL("/api/supplier/get-suppliers")
    );
    return response.data;
  },

  getSupplierById: async (id) => {
    const response = await axios.get(
      constructURL(`/api/supplier/get-supplier/${id}`)
    );
    return response.data;
  },

  addRawMaterial: async (materialData, images) => {
    const formData = new FormData();
    Object.keys(materialData).forEach((key) => {
      formData.append(key, materialData[key]);
    });

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axios.post(
      constructURL("/api/supplier/add-material"),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  updateRawMaterial: async (materialId, materialData, images) => {
    const formData = new FormData();
    Object.keys(materialData).forEach((key) => {
      formData.append(key, materialData[key]);
    });

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axios.put(
      constructURL(`/api/supplier/update-material/${materialId}`),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteRawMaterial: async (materialId) => {
    const response = await axios.delete(
      constructURL(`/api/supplier/delete-material/${materialId}`)
    );
    return response.data;
  },

  getMySupplierData: async () => {
    const response = await axios.get(constructURL("/api/supplier/my-data"));
    return response.data;
  },

  getAllRawMaterials: async () => {
    const response = await axios.get(
      constructURL("/api/supplier/raw-materials")
    );
    return response.data;
  },
};

// Stock API
export const stockAPI = {
  addStock: async (stockData, images) => {
    const formData = new FormData();
    Object.keys(stockData).forEach((key) => {
      formData.append(key, stockData[key]);
    });

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axios.post(
      constructURL("/api/stock/add"),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  updateStock: async (stockId, stockData, images) => {
    const formData = new FormData();
    Object.keys(stockData).forEach((key) => {
      formData.append(key, stockData[key]);
    });

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axios.put(
      constructURL(`/api/stock/update/${stockId}`),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteStock: async (stockId) => {
    const response = await axios.delete(
      constructURL(`/api/stock/delete/${stockId}`)
    );
    return response.data;
  },

  getAllStocks: async () => {
    const response = await axios.get(constructURL("/api/stock/all"));
    return response.data;
  },

  getUserStocks: async () => {
    const response = await axios.get(constructURL("/api/stock/my-stocks"));
    return response.data;
  },

  getStockById: async (stockId) => {
    const response = await axios.get(constructURL(`/api/stock/${stockId}`));
    return response.data;
  },

  getStocksBySupplier: async (supplierId) => {
    const response = await axios.get(
      constructURL(`/api/stock/supplier/${supplierId}`)
    );
    return response.data;
  },

  getStocksByMaterial: async (materialId) => {
    const response = await axios.get(
      constructURL(`/api/stock/material/${materialId}`)
    );
    return response.data;
  },
};

// Image API
export const imageAPI = {
  uploadImage: async (image) => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      constructURL("/api/image/upload"),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  uploadMultipleImages: async (images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await axios.post(
      constructURL("/api/image/upload-multiple"),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteImage: async (publicId) => {
    const response = await axios.delete(
      constructURL(`/api/image/delete/${publicId}`)
    );
    return response.data;
  },

  getImageDetails: async (publicId) => {
    const response = await axios.get(
      constructURL(`/api/image/details/${publicId}`)
    );
    return response.data;
  },
};

// Vendor API
export const vendorAPI = {
  getVendorData: async () => {
    const response = await axios.get(constructURL("/api/vendor/my-data"));
    return response.data;
  },

  getAllVendors: async () => {
    const response = await axios.get(
      constructURL("/api/vendor/getall-vendors")
    );
    return response.data;
  },

  getVendorById: async (id) => {
    const response = await axios.get(
      constructURL(`/api/vendor/get-vendor/${id}`)
    );
    return response.data;
  },

  createVendor: async (vendorData) => {
    const response = await axios.post(
      constructURL("/api/vendor/create-vendor"),
      vendorData
    );
    return response.data;
  },

  predictPrice: async (priceData) => {
    const response = await axios.post(
      constructURL("/api/vendor/predict-price"),
      priceData
    );
    return response.data;
  },

  addPreferredMaterial: async (id, materialId) => {
    const response = await axios.post(
      constructURL(`/api/vendor/preferred-material/${id}`),
      { materialId }
    );
    return response.data;
  },

  removePreferredMaterial: async (id, materialId) => {
    const response = await axios.delete(
      constructURL(`/api/vendor/preferred-material/${id}/${materialId}`)
    );
    return response.data;
  },

  // Note: The following endpoints are defined in frontend but not implemented in backend
  // You may need to implement these in the backend if required:
  // updateVendor: async (id, vendorData) => {
  //   const response = await axios.put(
  //     constructURL(`/api/vendor/update/${id}`),
  //     vendorData
  //   );
  //   return response.data;
  // },

  // deleteVendor: async (id) => {
  //   const response = await axios.delete(
  //     constructURL(`/api/vendor/delete/${id}`)
  //   );
  //   return response.data;
  // },
};
