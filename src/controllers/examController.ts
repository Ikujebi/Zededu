// src/controllers/examController.ts
import { Request, Response } from "express";
import * as ExamModel from "../models/examModel";
import * as ResultModel from "../models/resultModel";

// ================== EXAMS ==================

// Create exam
export const createExam = async (req: Request, res: Response) => {
  try {
    const exam = await ExamModel.createExam(req.body);
    res.status(201).json(exam);
  } catch (error) {
    console.error("❌ createExam error:", error);
    res.status(500).json({ error: "Failed to create exam" });
  }
};

// List exams
export const getExams = async (_req: Request, res: Response) => {
  try {
    const exams = await ExamModel.getAllExams();
    res.json(exams);
  } catch (error) {
    console.error("❌ getExams error:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

// Get exam by ID
export const getExamById = async (req: Request, res: Response) => {
  try {
    const exam = await ExamModel.getExamById(Number(req.params.id));
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (error) {
    console.error("❌ getExamById error:", error);
    res.status(500).json({ error: "Failed to fetch exam" });
  }
};

// Update exam
export const updateExam = async (req: Request, res: Response) => {
  try {
    const updated = await ExamModel.updateExam(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Exam not found" });
    res.json(updated);
  } catch (error) {
    console.error("❌ updateExam error:", error);
    res.status(500).json({ error: "Failed to update exam" });
  }
};

// Delete exam
export const deleteExam = async (req: Request, res: Response) => {
  try {
    await ExamModel.deleteExam(Number(req.params.id));
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("❌ deleteExam error:", error);
    res.status(500).json({ error: "Failed to delete exam" });
  }
};

// ================== RESULTS ==================

// Upload results for exam (bulk insert)
export const uploadResults = async (req: Request, res: Response) => {
  try {
    const examId = Number(req.params.id);
    const results = req.body.results; // [{ studentId, score }, ...]

    const createdResults = await Promise.all(
      results.map((r: any) =>
        ResultModel.createResult({ examId, studentId: r.studentId, score: r.score })
      )
    );

    res.status(201).json(createdResults);
  } catch (error) {
    console.error("❌ uploadResults error:", error);
    res.status(500).json({ error: "Failed to upload results" });
  }
};

// View results for an exam
export const getExamResults = async (req: Request, res: Response) => {
  try {
    const examId = Number(req.params.id);
    const results = await ResultModel.getAllResults(); // or create a specific ResultModel.getResultsByExamId()
    const filtered = results.filter(r => r.examId === examId);
    res.json(filtered);
  } catch (error) {
    console.error("❌ getExamResults error:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

// Get student results
export const getStudentResults = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.id);
    const results = await ResultModel.getAllResults(); // or ResultModel.getResultsByStudentId()
    const filtered = results.filter(r => r.studentId === studentId);
    res.json(filtered);
  } catch (error) {
    console.error("❌ getStudentResults error:", error);
    res.status(500).json({ error: "Failed to fetch student results" });
  }
};
