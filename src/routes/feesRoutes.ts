import { Router } from "express";
import {
  createFee,
  listFees,
  updateFee,
  deleteFee,
} from "../controllers/feesController";
import {
  authenticateUser,
  authorizeRoles,
} from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/fees",
  authenticateUser,
  authorizeRoles("super_admin", "school_admin"),
  createFee
);
router.get("/fees", authenticateUser, listFees);
router.patch(
  "/fees/:id",
  authenticateUser,
  authorizeRoles("super_admin", "school_admin"),
  updateFee
);
router.delete(
  "/fees/:id",
  authenticateUser,
  authorizeRoles("super_admin", "school_admin"),
  deleteFee
);

export default router;
