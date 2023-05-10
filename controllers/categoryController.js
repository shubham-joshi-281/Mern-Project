import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// CREATING CATEGORY CONTROLLER
const createCategoryController = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(401).json({
      success: false,
      message: "Name Is Required",
    });
  }
  const existingCategory = await categoryModel.findOne({ name });
  if (existingCategory) {
    return res.status(200).json({
      success: false,
      message: "Category Already Exist ",
    });
  }
  const category = await new categoryModel({
    name,
    slug: slugify(name),
  }).save();
  res.status(201).json({
    success: true,
    message: "Category Is Added...",
    category,
  });
};
try {
} catch (error) {
  console.log(error);
  res.status(500).json({
    success: false,
    message: "Error In Catergory",
    error,
  });
}

// UPDATING CATEGORY CONTROLLER
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Category Updated",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error In Updating Category",
      error,
    });
  }
};

// READING ALL CATEGORY CONTROLLER
const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.status(201).json({
      success: true,
      message: "Get All Category ",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error In Getting All Category",
      error,
    });
  }
};

// READING SPECIFIC CATEGORY CONTROLLER
const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(201).json({
      success: true,
      message: "Get Category ",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error In Getting Category",
      error,
    });
  }
};

// DELETE ALL CATEGORY CONTROLLER
const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      message: "Category Deleted.. ",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error In Deleting Category",
      error,
    });
  }
};

export {
  createCategoryController,
  updateCategoryController,
  getAllCategoryController,
  deleteCategoryController,
  getCategoryController,
};
