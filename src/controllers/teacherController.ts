// src/controllers/teacherController.ts
import { Request, Response } from "express";
import { TeacherModel } from "../models/teacherModel";

// CREATE
export const createTeacher = async (req: Request, res: Response) => {
  const { name, email, school_id, subject } = req.body;

  try {
    const teacher = await TeacherModel.create(name, email, school_id, subject);
    res.status(201).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create teacher" });
  }
};

// READ - All
export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await TeacherModel.getAll();
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch teachers" });
  }
};

// READ - One
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await TeacherModel.getById(Number(req.params.id));
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch teacher" });
  }
};

// UPDATE
export const updateTeacher = async (req: Request, res: Response) => {
  const { name, email, school_id, subject } = req.body;

  try {
    const updatedTeacher = await TeacherModel.update(
      Number(req.params.id),
      name,
      email,
      school_id,
      subject
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(updatedTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update teacher" });
  }
};

// DELETE
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const deletedTeacher = await TeacherModel.delete(Number(req.params.id));
    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete teacher" });
  }
};
