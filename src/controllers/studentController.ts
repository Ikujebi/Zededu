import { Response } from "express";
import { StudentModel } from "../models/studentModel";
import pool from "../db"; 
import { AuthRequest } from "../middlewares/authMiddleware";

// CREATE
export const createStudent = async (req: AuthRequest, res: Response) => {
  const { name, email, school_id, class_name } = req.body;

  try {
    const student = await StudentModel.create(name, email, school_id, class_name);
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create student" });
  }
};

// READ - All
export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const { classId, schoolId, status, name } = req.query;

    let query = "SELECT * FROM students WHERE 1=1";
    const values: any[] = [];

    if (classId) {
      values.push(classId);
      query += ` AND class_id = $${values.length}`;
    }

    // If school admin, force school_id from token
    let effectiveSchoolId = schoolId;
    if (req.user?.role === "school_admin") {
      effectiveSchoolId = String(req.user.school_id);
    }

    if (effectiveSchoolId) {
      values.push(effectiveSchoolId);
      query += ` AND school_id = $${values.length}`;
    }

    if (status) {
      values.push(status);
      query += ` AND status = $${values.length}`;
    }

    if (name) {
      values.push(`%${name}%`);
      query += ` AND (first_name ILIKE $${values.length} OR last_name ILIKE $${values.length})`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching students", err);
    res.status(500).json({ message: "Server error" });
  }
};

// READ - One (force school_id if admin)
export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    let query = `SELECT * FROM students WHERE id = $1`;
    const values: any[] = [id];

    // Ensure school admin only fetches from their school
    if (req.user?.role === "school_admin") {
      query += " AND school_id = $2";
      values.push(req.user.school_id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch student" });
  }
};

// UPDATE
export const updateStudent = async (req: AuthRequest, res: Response) => {
  const { name, email, school_id, class_name } = req.body;

  try {
    const updatedStudent = await StudentModel.update(
      Number(req.params.id),
      name,
      email,
      school_id,
      class_name
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update student" });
  }
};

// DELETE
export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await StudentModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete student" });
  }
};
