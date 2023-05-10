import productModel from "../models/ProductModel.js";
import fs from "fs";
import slugify from "slugify";

// CREATE PRODUCT CONTROLLER
const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(401).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).json({
      success: true,
      message: "Product Created Successfully...",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error In Creating Product ",
      error,
    });
  }
};

// GET ALL PRODUCT CONTROLLER
const getAllProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(9)
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      countTotal: products.length,
      message: "All Products Item",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Getting Product",
      error,
    });
  }
};

// GET PRODUCT CONTROLLER
const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).json({
      success: true,
      message: "All Products Item",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Error in Getting Single product",
      error,
    });
  }
};

// GET PRODUCT PHOTO CONTROLLER
const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Error in Getting product Image",
      error,
    });
  }
};

// DELETE PRODUCT CONTROLLER
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productModel.findByIdAndDelete(id).select("-photo");
    res.status(200).json({
      success: true,
      message: "Product Item Deleted Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Error in Deleting product",
      error,
    });
  }
};

// UPDATE PRODUCT CONTROLLER
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// FILTER PRODUCT CONTROLLER
const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let arg = {};
    if (checked.length > 0) {
      arg.category = checked;
    }
    if (radio.length) {
      arg.price = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await productModel.find(arg);
    res.status(200).json({
      success: true,
      message: "filtered Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error in filtering products",
      error,
    });
  }
};

// SEARCH PRODUCT CONTROLLER
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [{ name: { $regex: keyword, $options: "i" } }],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error in searching produuct",
      error,
    });
  }
};

export {
  createProductController,
  getAllProductController,
  getProductController,
  getProductPhotoController,
  updateProductController,
  deleteProductController,
  productFilterController,
  searchProductController,
};
