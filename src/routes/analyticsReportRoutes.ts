// src/routes/reportRoutes.ts
import { Router } from "express";
import {
  getAttendanceReport,
  getResultsReport,
  getPaymentsReport,
  getSchoolPerformance,
  getAppPerformance,
} from "../controllers/analyticsReportController";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

// Analytics Reports
router.get(
  "/attendance",
  authenticateUser,
  authorizeRoles("teacher", "admin"),
  getAttendanceReport
);

router.get(
  "/results",
  authenticateUser,
  authorizeRoles("teacher", "admin"),
  getResultsReport
);

router.get(
  "/payments",
  authenticateUser,
  authorizeRoles("accountant", "admin"),
  getPaymentsReport
);

router.get(
  "/school-performance",
  authenticateUser,
  authorizeRoles("admin"),
  getSchoolPerformance
);

router.get(
  "/app-performance",
  authenticateUser,
  authorizeRoles("superadmin"),
  getAppPerformance
);

export default router;
