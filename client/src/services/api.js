import axios from "axios";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "https://cropsight-kdpv.onrender.com/";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await axios.post(
      `${backendUrl}/api/auth/register`,
      userData
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(
      `${backendUrl}/api/auth/login`,
      credentials
    );
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${backendUrl}/api/auth/logout`);
    return response.data;
  },

  sendVerifyOtp: async () => {
    const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
    return response.data;
  },

  verifyAccount: async (otp) => {
    const response = await axios.post(`${backendUrl}/api/auth/verify-account`, {
      otp,
    });
    return response.data;
  },

  sendResetOtp: async () => {
    const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`);
    return response.data;
  },

  resetPassword: async (otpData) => {
    const response = await axios.post(
      `${backendUrl}/api/auth/password-reset`,
      otpData
    );
    return response.data;
  },

  isAuthenticated: async () => {
    const response = await axios.get(`${backendUrl}/api/auth/is-auth`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getUserData: async () => {
    const response = await axios.get(`${backendUrl}/api/user/data`);
    return response.data;
  },

  getUserRole: async () => {
    const response = await axios.get(`${backendUrl}/api/user/role`);
    return response.data;
  },
};

// Supplier API
export const supplierAPI = {
  getAllSuppliers: async () => {
    const response = await axios.get(
      `${backendUrl}/api/supplier/get-suppliers`
    );
    return response.data;
  },

  getSupplierById: async (id) => {
    const response = await axios.get(
      `${backendUrl}/api/supplier/get-supplier/${id}`
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
      `${backendUrl}/api/supplier/add-material`,
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
      `${backendUrl}/api/supplier/update-material/${materialId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteRawMaterial: async (materialId) => {
    const response = await axios.delete(
      `${backendUrl}/api/supplier/delete-material/${materialId}`
    );
    return response.data;
  },

  getMySupplierData: async () => {
    const response = await axios.get(`${backendUrl}/api/supplier/my-data`);
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

    const response = await axios.post(`${backendUrl}/api/stock/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
      `${backendUrl}/api/stock/update/${stockId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteStock: async (stockId) => {
    const response = await axios.delete(
      `${backendUrl}/api/stock/delete/${stockId}`
    );
    return response.data;
  },

  getAllStocks: async () => {
    const response = await axios.get(`${backendUrl}/api/stock/all`);
    return response.data;
  },

  getStockById: async (stockId) => {
    const response = await axios.get(`${backendUrl}/api/stock/${stockId}`);
    return response.data;
  },

  getStocksBySupplier: async (supplierId) => {
    const response = await axios.get(
      `${backendUrl}/api/stock/supplier/${supplierId}`
    );
    return response.data;
  },

  getStocksByMaterial: async (materialId) => {
    const response = await axios.get(
      `${backendUrl}/api/stock/material/${materialId}`
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
      `${backendUrl}/api/image/upload`,
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
      `${backendUrl}/api/image/upload-multiple`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteImage: async (publicId) => {
    const response = await axios.delete(
      `${backendUrl}/api/image/delete/${publicId}`
    );
    return response.data;
  },

  getImageDetails: async (publicId) => {
    const response = await axios.get(
      `${backendUrl}/api/image/details/${publicId}`
    );
    return response.data;
  },
};

// Vendor API
export const vendorAPI = {
  getAllVendors: async () => {
    const response = await axios.get(`${backendUrl}/api/vendor/getall-vendors`);
    return response.data;
  },

  getVendorById: async (id) => {
    const response = await axios.get(
      `${backendUrl}/api/vendor/get-vendor/${id}`
    );
    return response.data;
  },

  createVendor: async (vendorData) => {
    const response = await axios.post(
      `${backendUrl}/api/vendor/create-vendor`,
      vendorData
    );
    return response.data;
  },

  predictPrice: async (priceData) => {
    const response = await axios.post(
      `${backendUrl}/api/vendor/predict-price`,
      priceData
    );
    return response.data;
  },

  // Note: The following endpoints are defined in frontend but not implemented in backend
  // You may need to implement these in the backend if required:
  // updateVendor: async (id, vendorData) => {
  //   const response = await axios.put(
  //     `${backendUrl}/api/vendor/update/${id}`,
  //     vendorData
  //   );
  //   return response.data;
  // },

  // deleteVendor: async (id) => {
  //   const response = await axios.delete(
  //     `${backendUrl}/api/vendor/delete/${id}`
  //   );
  //   return response.data;
  // },

  // addPreferredMaterial: async (id, materialId) => {
  //   const response = await axios.post(
  //     `${backendUrl}/api/vendor/${id}/preferred-material`,
  //     { materialId }
  //   );
  //   return response.data;
  // },

  // removePreferredMaterial: async (id, materialId) => {
  //   const response = await axios.delete(
  //     `${backendUrl}/api/vendor/${id}/preferred-material/${materialId}`
  //   );
  //   return response.data;
  // },
};
