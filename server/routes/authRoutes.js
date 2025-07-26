import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  sendPasswordResetOtp,
  verifyEmail,
  verifyOtp,
  verifyPasswordReset,
} from "../controllers/authController.js";
import userauth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userauth, verifyOtp);
authRouter.post("/verify-account", userauth, verifyEmail);
authRouter.post("/send-reset-otp", userauth, sendPasswordResetOtp);
authRouter.post("/password-reset", userauth, verifyPasswordReset);
authRouter.get("/is-auth", userauth, isAuthenticated);

export default authRouter;
