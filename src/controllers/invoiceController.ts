import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { InvoiceModel } from "../models/invoiceModel";

// -------------------- CREATE INVOICE --------------------
export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { student_id, due_date, items } = req.body;
    const school_id = req.user?.school_id;

    if (!student_id || !due_date || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const invoice = await InvoiceModel.createInvoice(
      school_id!,
      student_id,
      due_date,
      items
    );

    res.status(201).json(invoice);
  } catch (error: any) {
    console.error("Error creating invoice:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- LIST INVOICES --------------------
export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === "student") {
      const invoices = await InvoiceModel.getInvoicesByStudent(req.user.student_id!);
      return res.json(invoices);
    }

    // Admin/staff: TODO - add a method to get all invoices (currently missing in model)
    return res.status(403).json({ error: "Not authorized" });
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- GET INVOICE BY ID --------------------
export const getInvoiceById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.getInvoiceById(Number(id));

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    // Restrict: students can only access their own invoices
    if (req.user?.role === "student" && invoice.student_id !== req.user.student_id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- UPDATE INVOICE STATUS --------------------
export const updateInvoiceStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unpaid", "partial", "paid"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const invoice = await InvoiceModel.updateInvoiceStatus(Number(id), status);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- DELETE INVOICE --------------------
export const deleteInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await InvoiceModel.deleteInvoice(Number(id));
    res.json({ message: "Invoice deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};