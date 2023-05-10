import userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// REGISTER USER CONTROLLER

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //VALIDATION OF ALL FIELDS
    if (!name) {
      return res.status(404).json({
        success: false,
        message: "Name Is Required",
      });
    }
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email Is Required",
      });
    }
    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Password Is Required",
      });
    }
    if (!phone) {
      return res.status(404).json({
        success: false,
        message: "Phone Number Is Required",
      });
    }
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address Is Required",
      });
    }
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Question Answer Is Required",
      });
    }

    //VALIDATION OF EXISTING USER
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).json({
        success: false,
        message: "User Already Register",
      });
    }

    // HASHED PASSWORD FOR SECURITY
    const hashedPassword = await hashPassword(password);
    // REGISTER USER
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).json({
      success: true,
      message: "User Register Successfully...",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong In User Registration",
      error,
    });
  }
};

// LOGIN USER CONTROLLER
const loginContoller = async (req, res) => {
  try {
    const { email, password } = req.body;
    //VALIDATION OF ALL FIELDS
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email Or Password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email Is Not Registerd",
      });
    }

    // COMPARING PASSWORD
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }
    // JWT TOKEN
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "User Login Successfully...",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        answer: user.answer,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong In User Login",
      error,
    });
  }
};

// FORGET PASSWORD CONTROLLER
const resetContoller = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    //VALIDATION OF ALL FIELDS
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }
    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "Question - Answer Is Required To Reset Your Password",
      });
    }
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password Is Required",
      });
    }

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findById(user._id, { password: hashed });
    res.status(200).json({
      success: true,
      message: "Password Changed Successfully...",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong In Reset Password",
      error,
    });
  }
};

// UPDATE USER PROFILE CONTROLLER
const updateController = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;
    // register user
    const user = await userModel.findById(req.body._id);
    if (password) {
      return res.status(404).json({
        success: false,
        message: "Password is Required",
      });
    }
    const hashedPassword = password
      ? await hashPassword(password)
      : "undefined";
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "User Profile Update Successfully...",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: " something Went Wrong In Updating User Profile",
      error,
    });
  }
};

export { registerController, loginContoller, resetContoller, updateController };
