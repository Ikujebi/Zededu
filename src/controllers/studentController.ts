import { Request, Response } from "express";
import { StudentModel } from "../models/studentModel";

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
    const student = await StudentModel.getById(Number(req.params.id));
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch student" });
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
