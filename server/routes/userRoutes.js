import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData, getUserRole } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/role", userAuth, getUserRole);

export default userRouter;
