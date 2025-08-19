import { Router } from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice,
} from "../controllers/invoiceController";
import { authenticateUser,authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

// Invoice routes (protected)
router.post("/invoices", authenticateUser,authorizeRoles("admin", ), createInvoice);
router.get("/invoices", authenticateUser, getInvoices);
router.get("/invoices/:id", authenticateUser, getInvoiceById);
router.patch("/invoices/:id", authenticateUser,authorizeRoles("admin", ), updateInvoiceStatus);
router.delete("/invoices/:id", authenticateUser,authorizeRoles("admin", ), deleteInvoice);

export default router;
