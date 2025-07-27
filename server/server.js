import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDatabase from "./config/connectDb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import supplierRouter from "./routes/supplierRoutes.js";
import vendorRouter from "./routes/vendorRoutes.js";

const app = express();

const port = process.env.PORT || 4000;
connectDatabase();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(morgan("dev"));

//Api Endpoints
app.get("/", (req, res) => {
  res.send("Api Working fine");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/vendor", vendorRouter);

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
