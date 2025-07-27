import supplierModel from "../models/supplier.model.js";
import vendorModel from "../models/vendor.model.js";

export const PredictPriceController = async (req, res) => {
  try {
    const { materialId } = req.body;
    if (!materialId) {
      return res.status(400).send({
        success: false,
        message: "materialId is required",
      });
    }

    const suppliers = await supplierModel.find({
      "rawMaterials.materialId": materialId,
    });

    let prices = [];
    suppliers.forEach((supplier) => {
      supplier.rawMaterials.forEach((rm) => {
        if (rm.materialId.toString() === materialId) {
          prices.push(rm.price);
        }
      });
    });

    if (prices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No price data found for this material",
      });
    }

    const predictedPrice =
      prices.reduce((acc, val) => acc + val, 0) / prices.length;

    return res.json({
      success: true,
      materialId,
      predictedPrice,
      prices,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "Something error in Predicting Price",
    });
  }
};

//create vendor
export const createVendorController = async (req, res) => {
  try {
    const { userId, preferredMaterials } = req.body;
    if (!userId) {
      return res.status(500).send({
        success: false,
        message: "userId is required",
      });
    }

    const existingVendor = await vendorModel.findOne({ userId });
    if (existingVendor) {
      return res.status(500).send({
        success: false,
        message: "vendor already exists for this user",
      });
    }
    const vendor = new vendorModel({
      userId,
      preferredMaterials: preferredMaterials || [],
    });
    await vendor.save();
    return res.status(201).send({
      success: true,
      message: "vendor created successfully",
      vendor,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something went wrong in creating vendor",
    });
  }
};

//getAllVendorsController

export const getAllVendorsController = async (req, res) => {
  try {
    const vendors = await vendorModel
      .find()
      .populate("userId", "name email")
      .populate("preferredMaterials");
    return res.status(200).send({
      success: true,
      message: "got all vendors successfully",
      vendors,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "Cannot get all vendors",
    });
  }
};

//getsingleVendors

export const getSingleVendorController = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorModel
      .findById(id)
      .populate("userId", "name email")
      .populate("preferredMaterials");
    if (!vendor) {
      return res.status(500).send({
        success: false,
        message: "vendor not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "vendor fetched Successfully",
      vendor,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

//update vendor

export const UpdateVendorController = async (req, res) => {
  try {
    const { id } = req.params;
    const { preferredMaterials } = req.body;

    const vendor = await vendorModel.findByIdAndUpdate(id);
    if (!vendor) {
      return res.status(404).send({
        success: false,
        message: "vendor not found",
      });
    }
    if (preferredMaterials) {
      vendor.preferredMaterials = preferredMaterials;
    }

    await vendor.save();
    return res.status(200).send({
      success: true,
      message: "vendor updated successfully",
      vendor,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({
      success: false,
      message: "something went wrong in updation",
    });
  }
};

//delete vendor

export const DeleteVendorController = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await vendorModel.findByIdAndDelete(id);
    if (!vendor) {
      return res.status(500).send({
        success: false,
        message: "vendor not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "vendor created successfully",
      vendor,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something went wrong",
    });
  }
};

//addpreferred material
export const addPreferredMaterialController = async (req, res) => {
  try {
    const { id } = req.params;
    const { materialId } = req.body;

    if (!materialId) {
      return res.status(500).send({
        success: false,
        message: "materialId is required",
      });
    }
    const vendor = await vendorModel.findById(id);
    if (!vendor) {
      return res.status(404).send({
        success: false,
        message: "Vendor not found",
      });
    }

    if (!vendor.preferredMaterials.includes(materialId)) {
      vendor.preferredMaterials.push(materialId);
      await vendor.save();
    }

    return res.status(200).send({
      success: true,
      message: "Preferred material added",
      vendor,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(404).send({
      success: false,
      message: "something went wrong",
    });
  }
};

//delete
export const deletePreferredMaterialIdController = async (req, res) => {
  try {
    const { id, materialId } = req.params;

    const vendor = await vendorModel.findById(id);
    if (!vendor) {
      return res.status(404).send({
        success: false,
        message: "Vendor not found",
      });
    }

    vendor.preferredMaterials = vendor.preferredMaterials.filter(
      (mat) => mat.toString() !== materialId
    );
    await vendor.save();

    return res.status(200).send({
      success: true,
      message: "Preferred material removed",
      vendor,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};
