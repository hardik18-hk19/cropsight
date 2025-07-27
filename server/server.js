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
import stockRouter from "./routes/stockRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();

const port = process.env.PORT || 4000;
connectDatabase();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cropsight-coral.vercel.app",
  "https://cropsight-coral.vercel.app/",
];

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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(morgan("dev"));

// Middleware to handle double slashes in URLs
app.use((req, res, next) => {
  if (req.url.includes("//")) {
    const cleanUrl = req.url.replace(/\/+/g, "/");
    console.log(`🔧 Fixed double slash: ${req.url} → ${cleanUrl}`);
    req.url = cleanUrl;
  }
  next();
});

//Api Endpoints
app.get("/", (req, res) => {
  res.send("Api Working fine");
});

// Debug endpoint to test URL construction
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working", url: req.url });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/stock", stockRouter);
app.use("/api/image", imageRouter);

app.listen(port, () => {
  console.log(`Server Started on Port ${port}`);
});
