// src/routes/receiptRoutes.ts
import { Router } from "express";
import { createNewReceipt, getReceipt, getStudentReceipts, getAllReceiptsHandler } from "../controllers/receiptController";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

// Student & Admin protected routes
router.post("/receipts", authenticateUser, createNewReceipt);
router.get("/receipts/:id", authenticateUser, getReceipt);
router.get("/students/:studentId/receipts", authenticateUser, getStudentReceipts);

// Admin only
router.get("/receipts", authenticateUser, authorizeRoles("admin"), getAllReceiptsHandler);

export default router;
