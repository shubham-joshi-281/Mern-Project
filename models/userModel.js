import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name Is Mandatory"],
    },
    email: {
      type: String,
      required: [true, "Email Is Mandatory"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password Is Mandatory"],
    },
    phone: {
      type: Number,
      required: [true, "Number Is Mandatory"],
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);

export default userModel;
