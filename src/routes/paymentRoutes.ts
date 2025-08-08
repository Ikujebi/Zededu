// src/routes/paymentRoute.ts
import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment
} from "../controllers/paymentController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { paymentAuth } from "../middlewares/paymentAuth";

const router = express.Router();

// Create payment → only admin
router.post("/", authenticateUser, paymentAuth(["admin"]), createPayment);

// Get all payments → only admin
router.get("/", authenticateUser, paymentAuth(["admin"]), getPayments);

// Get payment by ID → admin or parent
router.get("/:id", authenticateUser, paymentAuth(["admin", "parent"]), getPaymentById);

// Update payment → only admin
router.put("/:id", authenticateUser, paymentAuth(["admin"]), updatePayment);

// Delete payment → only admin
router.delete("/:id", authenticateUser, paymentAuth(["admin"]), deletePayment);

export default router;
