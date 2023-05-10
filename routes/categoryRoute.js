import express from "express";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  getAllCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";
const router = express.Router();

// CREATE CATEGORY || POST METHOD
router.post("/create-category", verifyToken, isAdmin, createCategoryController);

// UPDATE CATEGORY  || PUT METHOD
router.put(
  "/update-category/:id",
  verifyToken,
  isAdmin,
  updateCategoryController
);

//  READ ALL CATEGORY || GET METHOD
router.get("/all-category", getAllCategoryController);

// READ SPECIFIC CATEGORY || GET METHOD
router.get("/all-category/:slug", getCategoryController);

// DELETE CATEGORY || DELETE METHOD
router.delete(
  "/delete-category/:id",
  verifyToken,
  isAdmin,
  deleteCategoryController
);

export default router;
