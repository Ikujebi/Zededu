// src/routes/examRoutes.ts
import { Router } from "express";
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  uploadResults,
  getExamResults,
  getStudentResults,
} from "../controllers/examController";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware";

const router = Router();

// Exams
router.post("/exams", authenticateUser, authorizeRoles("admin", "teacher"), createExam);
router.get("/exams", authenticateUser, getExams);
router.get("/exams/:id", authenticateUser, getExamById);
router.patch("/exams/:id", authenticateUser, authorizeRoles("admin", "teacher"), updateExam);
router.delete("/exams/:id", authenticateUser, authorizeRoles("admin"), deleteExam);

// Results
router.post("/exams/:id/results", authenticateUser, authorizeRoles("teacher"), uploadResults);
router.get("/exams/:id/results", authenticateUser, getExamResults);
router.get("/results/student/:id", authenticateUser, getStudentResults);

export default router;
