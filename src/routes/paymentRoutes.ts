import { Router } from "express";
import { recordPayment, listPayments, getPaymentDetails, getStudentPayments, verifyPayment } from "../controllers/paymentController";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware";


const router = Router();

router.post("/payments",authenticateUser, recordPayment);
router.get("/payments",authenticateUser, listPayments);
router.get("/payments/:id",authenticateUser, getPaymentDetails);
router.get("/payments/student/:id",authenticateUser, getStudentPayments);
router.post("/payments/verify",authenticateUser, verifyPayment);

export default router;
