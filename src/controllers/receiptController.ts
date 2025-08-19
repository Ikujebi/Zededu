// src/controllers/receiptController.ts
import { Request, Response } from "express";
import { createReceipt, getReceiptById, getReceiptsByStudent, getAllReceipts } from "../models/receiptModel";
import { Receipt } from "../models/receiptModel";

// utility to generate receipt numbers (simple version)
const generateReceiptNumber = (): string => {
  const prefix = "RCP";
  const now = new Date();
  return `${prefix}-${now.getFullYear()}${(now.getMonth()+1)
    .toString()
    .padStart(2,"0")}${now.getDate().toString().padStart(2,"0")}-${Date.now()}`;
};

// Create new receipt (usually triggered after a payment)
export const createNewReceipt = async (req: Request, res: Response) => {
  try {
    const { student_id, invoice_id, payment_id, amount_paid, payment_method, notes } = req.body;

    if (!student_id || !invoice_id || !payment_id || !amount_paid) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const receipt: Receipt = {
      receipt_number: generateReceiptNumber(),
      student_id,
      invoice_id,
      payment_id,
      amount_paid,
      payment_method,
      created_by: (req.user as any)?.id || null, // if you attach user to req
      notes,
    };

    const newReceipt = await createReceipt(receipt);
    res.status(201).json(newReceipt);
  } catch (error: any) {
    console.error("Error creating receipt:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get one receipt
export const getReceipt = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const receipt = await getReceiptById(id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    res.json(receipt);
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all receipts for a student
export const getStudentReceipts = async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const receipts = await getReceiptsByStudent(studentId);
    res.json(receipts);
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all receipts (admin only maybe)
export const getAllReceiptsHandler = async (req: Request, res: Response) => {
  try {
    const receipts = await getAllReceipts();
    res.json(receipts);
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};
