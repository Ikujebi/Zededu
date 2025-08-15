import { Request, Response } from "express";
import { StudentModel } from "../models/studentModel";
import pool from "../db"; 


// CREATE
export const createStudent = async (req: Request, res: Response) => {
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
export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await StudentModel.getAll();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch students" });
  }
};

// READ - One
export const getStudentById = async (req: Request, res: Response) => {
    try {
    const { class_name, school_id, status } = req.query;

    let query = `SELECT * FROM students WHERE 1=1`;
    const values: any[] = [];
    let idx = 1;

    // If the user is a school admin, force their school_id
    let effectiveSchoolId = school_id;
    if (req.user?.role === "school_admin") {
      effectiveSchoolId = String(req.user.school_id);
    }

    if (effectiveSchoolId) {
      query += ` AND school_id = $${idx++}`;
      values.push(effectiveSchoolId);
    }
    if (class_name) {
      query += ` AND class_name = $${idx++}`;
      values.push(class_name);
    }
    if (status) {
      query += ` AND status = $${idx++}`;
      values.push(status);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch students" });
  }
};

// UPDATE
export const updateStudent = async (req: Request, res: Response) => {
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
export const deleteStudent = async (req: Request, res: Response) => {
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
