import { Response } from "express";
import { PaymentModel } from "../models/paymentModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// -------------------- RECORD PAYMENT --------------------
export const recordPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { student_id, fee_id, amount, method, status, reference } = req.body;

    // Only admins can record payments manually
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Only admins can record payments" });
    }

    const payment = await PaymentModel.recordPayment(
      student_id,
      fee_id,
      amount,
      method,
      status,
      reference
    );
    res.status(201).json(payment);
  } catch (err) {
    console.error("recordPayment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- LIST PAYMENTS --------------------
export const listPayments = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === "admin") {
      // Admin → all payments
      const payments = await PaymentModel.getPayments();
      return res.json(payments);
    }

    if (req.user?.role === "student" || req.user?.role === "parent") {
      // Student/Parent → only their own
      const payments = await PaymentModel.getPaymentsByStudent(req.user.student_id);
      return res.json(payments);
    }

    res.status(403).json({ message: "Unauthorized" });
  } catch (err) {
    console.error("listPayments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- PAYMENT DETAILS --------------------
export const getPaymentDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await PaymentModel.getPaymentById(Number(id));
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Restrict access: students/parents can only see their own payment
    if (req.user?.role !== "admin" && payment.student_id !== req.user?.student_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(payment);
  } catch (err) {
    console.error("getPaymentDetails:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- STUDENT PAYMENTS --------------------
export const getStudentPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Admin can query any student
    if (req.user?.role === "admin") {
      const payments = await PaymentModel.getPaymentsByStudent(Number(id));
      return res.json(payments);
    }

    // Student/Parent can only fetch their own
    if (req.user?.role === "student" || req.user?.role === "parent") {
      if (Number(id) !== req.user?.student_id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const payments = await PaymentModel.getPaymentsByStudent(Number(id));
      return res.json(payments);
    }

    res.status(403).json({ message: "Unauthorized" });
  } catch (err) {
    console.error("getStudentPayments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- VERIFY PAYMENT --------------------
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { reference } = req.body;
    const payment = await PaymentModel.verifyPayment(reference);

    // Restrict access
    if (req.user?.role !== "admin" && payment.student_id !== req.user?.student_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(payment);
  } catch (err) {
    console.error("verifyPayment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
