// src/controllers/assignmentController.ts
import { Request, Response } from "express";
import pool from "../db";
import { AuthRequest } from "../middlewares/authMiddleware";

// Create a new assignment
export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, due_date, class_id } = req.body;
    const created_by = req.user?.id;

    if (!created_by) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const result = await pool.query(
      `INSERT INTO assignments (title, description, due_date, class_id, created_by) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, due_date, class_id, created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating assignment:", err);
    res.status(500).json({ error: "Failed to create assignment" });
  }
};

// Get all assignments
export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM assignments ORDER BY due_date ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

// Get assignment by ID
export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM assignments WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching assignment:", err);
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
};

// Update assignment
export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, class_id } = req.body;

    const result = await pool.query(
      `UPDATE assignments 
       SET title = $1, description = $2, due_date = $3, class_id = $4, updated_at = NOW() 
       WHERE id = $5 RETURNING *`,
      [title, description, due_date, class_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating assignment:", err);
    res.status(500).json({ error: "Failed to update assignment" });
  }
};

// Delete assignment
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM assignments WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
};

// Submit assignment
export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // assignment id
    const { content, file_url } = req.body;
    const student_id = req.user?.id;

    if (!student_id) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const result = await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, content, file_url) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, student_id, content, file_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ error: "Failed to submit assignment" });
  }
};

// Get submissions for an assignment
export const getSubmissionsByAssignmentId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT s.*, u.name as student_name 
       FROM submissions s
       JOIN users u ON s.student_id = u.id
       WHERE s.assignment_id = $1
       ORDER BY s.submitted_at DESC`,
      [id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};
