import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// file import
import connectDB from "./db/connectDB.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productItemRoute from "./routes/productItemRoute.js";
import orderRoute from "./routes/orderRoute.js";
const app = express();

// configure
dotenv.config();

// es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// middleware
app.use(express.static(path.join(__dirname, "./client/build")));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product-item", productItemRoute);
app.use("/api/v1/order", orderRoute);

app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Server Listen & Data Base Connection
const start = () => {
  connectDB();
  const PORT = process.env.PORT || "8080";
  app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
  });
};
start();
