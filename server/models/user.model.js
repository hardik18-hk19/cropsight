import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOTP: { type: String, default: "" },
  verifyOTPexpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  userRole: {
    type: String,
    enum: ["supplier", "vendor"],
    default: "supplier",
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
