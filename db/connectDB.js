import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MANGO_URL);
    console.log(`Data Base Connected Successfully...`);
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
