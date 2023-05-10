import express from "express";
import {
  loginContoller,
  registerController,
  resetContoller,
  updateController,
} from "../controllers/authController.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// REGISTER||  METHOD POST
router.post("/register", registerController);

// LOGIN||  METHOD POST
router.post("/login", loginContoller);

// LOGOUT||  METHOD POST
router.post("/forgot-password", resetContoller);

// PROTECTED ROUTE FOR USER||  METHOD GET
router.get("/user-auth", verifyToken, (req, res) => {
  res.status(200).send({ ok: true });
});

// PROTECTED ROUTE FOR ADMIN||  METHOD GET
router.get("/admin-auth", verifyToken, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// UPDATE PROFILE||  METHOD PUT
router.put("/user-update", verifyToken, updateController);

export default router;
