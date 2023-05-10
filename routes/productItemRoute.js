import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getProductController,
  getProductPhotoController,
  productFilterController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

// CREATE PRODUCT || POST METHOD
router.post(
  "/create-product",
  verifyToken,
  isAdmin,
  formidable(),
  createProductController
);

// READ ALL PRODUCT || GET METHOD
router.get("/get-product", getAllProductController);

// READ PRODUCT || GET METHOD
router.get("/get-product/:slug", getProductController);

// READ PRODUCT PHOTO || GET METHOD
router.get("/product-photo/:pid", getProductPhotoController);

// DELETE PRODUCT || DELETE METHOD
router.delete(
  "/delete-product/:id",
  verifyToken,
  isAdmin,
  formidable(),
  deleteProductController
);

// UPDATE PRODUCT || PUT METHOD
router.put(
  "/update-product/:id",
  verifyToken,
  isAdmin,
  formidable(),
  updateProductController
);

// FILTER PRODUCT || POST METHOD
router.post("/product-filter", productFilterController);

// SEARCH PRODUCT || GET METHOD
router.get("/product-search/:keyword", searchProductController);

export default router;
