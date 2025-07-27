import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Configure axios defaults
axios.defaults.withCredentials = true;

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

// Vendor API (if needed)
export const vendorAPI = {
  getAllVendors: async () => {
    const response = await axios.get(`${backendUrl}/api/vendor/all`);
    return response.data;
  },

  getVendorById: async (id) => {
    const response = await axios.get(`${backendUrl}/api/vendor/${id}`);
    return response.data;
  },

  createVendor: async (vendorData) => {
    const response = await axios.post(
      `${backendUrl}/api/vendor/create`,
      vendorData
    );
    return response.data;
  },

  updateVendor: async (id, vendorData) => {
    const response = await axios.put(
      `${backendUrl}/api/vendor/update/${id}`,
      vendorData
    );
    return response.data;
  },

  deleteVendor: async (id) => {
    const response = await axios.delete(
      `${backendUrl}/api/vendor/delete/${id}`
    );
    return response.data;
  },

  addPreferredMaterial: async (id, materialId) => {
    const response = await axios.post(
      `${backendUrl}/api/vendor/${id}/preferred-material`,
      { materialId }
    );
    return response.data;
  },

  removePreferredMaterial: async (id, materialId) => {
    const response = await axios.delete(
      `${backendUrl}/api/vendor/${id}/preferred-material/${materialId}`
    );
    return response.data;
  },
};
