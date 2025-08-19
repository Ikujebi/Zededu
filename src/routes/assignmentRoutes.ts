// src/routes/assignmentRoutes.ts
import { Router } from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissionsByAssignmentId,
} from "../controllers/assignmentController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

// Only authenticated users can access these endpoints
router.post("/assignments", authenticateUser, createAssignment);
router.get("/assignments", authenticateUser, getAssignments);
router.get("/assignments/:id", authenticateUser, getAssignmentById);
router.patch("/assignments/:id", authenticateUser, updateAssignment);
router.delete("/assignments/:id", authenticateUser, deleteAssignment);

// Assignment submissions
router.post("/assignments/:id/submit", authenticateUser, submitAssignment);
router.get(
  "/assignments/:id/submissions",
  authenticateUser,
  getSubmissionsByAssignmentId
);

export default router;
