import orderModel from "../models/OrderModel.js";
import braintree from "braintree";
import dotenv from "dotenv";
dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// GET ORDER
const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in getting orders",
      error,
    });
  }
};

// GET ALL ORDER
const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in getting orders",
      error,
    });
  }
};

// UPDATE ORDER STATUS
const orderStatusUpdateController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in getting orders",
      error,
    });
  }
};

// BRAINTREE FOR TOKEN
const tokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// BRAINTREE FOR PAYMENT
const paymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Braintree token error",
      error,
    });
  }
};
export {
  getOrderController,
  getAllOrderController,
  tokenController,
  paymentController,
  orderStatusUpdateController,
};
