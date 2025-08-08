// src/controllers/paymentController.ts
import { Request, Response } from "express";
import { PaymentModel } from "../models/paymentModel";

// CREATE
export const createPayment = async (req: Request, res: Response) => {
  const { student_id, amount, payment_date, method, status } = req.body;

  try {
    const payment = await PaymentModel.create(student_id, amount, payment_date, method, status);
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create payment" });
  }
};

// READ - All
export const getPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await PaymentModel.getAll();
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch payments" });
  }
};

// READ - One
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await PaymentModel.getById(Number(req.params.id));
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch payment" });
  }
};

// UPDATE
export const updatePayment = async (req: Request, res: Response) => {
  const { student_id, amount, payment_date, method, status } = req.body;

  try {
    const updatedPayment = await PaymentModel.update(
      Number(req.params.id),
      student_id,
      amount,
      payment_date,
      method,
      status
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json(updatedPayment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update payment" });
  }
};

// DELETE
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const deleted = await PaymentModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete payment" });
  }
};
