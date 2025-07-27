import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import supplierModel from "../models/supplier.model.js";
import vendorModel from "../models/vendor.model.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

export const register = async (req, res) => {
  console.log("🔥 Register endpoint hit:", req.method, req.url);
  console.log("🔥 Request body:", req.body);

  const { name, email, password, userRole } = req.body;

  if (!name || !email || !password || !userRole) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      userRole,
    });

    await user.save();

    // Create corresponding supplier or vendor document
    if (userRole === "supplier") {
      const supplier = new supplierModel({
        userId: user._id,
        rawMaterials: [], // Empty array initially
      });
      await supplier.save();
    } else if (userRole === "vendor") {
      const vendor = new vendorModel({
        userId: user._id,
        preferredMaterials: [], // Empty array initially
      });
      await vendor.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Force secure for cross-origin
      sameSite: "none", // Force none for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome To Cropsight",
      text: `Welcome to Cropsight. Your Account has been created with email: ${email}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      // console.log("✅ Email sent:", info.response);
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }

    return res.json({
      success: true,
      debug: {
        tokenSet: true,
        environment: process.env.NODE_ENV,
        cookieConfig: {
          secure: true,
          sameSite: "none",
        },
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, userRole } = req.body;

  if (!email || !password || !userRole) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Wrong Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Force secure for cross-origin
      sameSite: "none", // Force none for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Also send token in response for debugging
    return res.json({
      success: true,
      message: "Login Successful",
      token,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // Force secure for cross-origin
      sameSite: "none", // Force none for cross-origin
      path: "/",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Send Otp For email verification

export const verifyOtp = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, error: "Account is Already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random(6) * 900000));
    user.verifyOTP = otp;
    user.verifyOTPexpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "OTP for Email Verification",
      // text: `OTP for email verification is ${otp}. It will expire in 1 day.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{OTP}}", otp).replace(
        "{{USERNAME}}",
        user.name
      ),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      // console.log("✅ Email sent:", info.response);
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }

    return res.json({
      success: true,
      message: "Verification OTP sent on email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify the email with otp sent
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId || req.body?.userId;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    if (user.verifyOTP == "" || user.verifyOTP !== otp) {
      return res.json({ success: false, message: "Wrong OTP!" });
    }

    if (user.verifyOTPexpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isAccountVerified = true;
    user.verifyOTP = "";
    user.verifyOTPexpireAt = 0;

    user.save();
    return res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    console.log("✅ User authenticated successfully, userId:", req.userId);
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      error: "Email is required",
    });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        error: "User not exists",
      });
    }

    const otp = String(Math.floor(100000 + Math.random(6) * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `OTP for reset password is ${otp}. It will expire in 15 minutes.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{OTP}}", otp).replace(
        "{{USERNAME}}",
        user.name
      ),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      // console.log("✅ Email sent:", info.response);
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }

    return res.json({
      success: true,
      message: "Password Reset OTP sent on email",
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const verifyPasswordReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    if (user.resetOtp == "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Wrong OTP!" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "Password has been reset Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
