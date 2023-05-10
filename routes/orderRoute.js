import express from "express";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  getAllOrderController,
  getOrderController,
  orderStatusUpdateController,
  paymentController,
  tokenController,
} from "../controllers/orderController.js";

const router = express.Router();

// READ TOKEN || GET METHOD
router.get("/braintree/token", tokenController);

// CREATE PAYMENT || POST METHOD
router.post("/braintree/payment", verifyToken, paymentController);

// READ ORDER || GET METHOD
router.get("/get-order", verifyToken, getOrderController);

// READ ALL ORDERS || GET METHOD
router.get("/get-all-orders", verifyToken, isAdmin, getAllOrderController);

// UPDATE ORDER STATUS || PUT METHOD
router.put(
  "/update-status/:orderId",
  verifyToken,
  isAdmin,
  orderStatusUpdateController
);

export default router;
