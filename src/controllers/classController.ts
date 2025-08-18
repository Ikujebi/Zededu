import { Response } from "express";
import { ClassModel } from "../models/classModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createClass = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  try {
    const newClass = await ClassModel.create(name, school_id);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ error: "Failed to create class" });
  }
};

export const getClasses = async (req: AuthRequest, res: Response) => {
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  try {
    const classes = await ClassModel.getAll(school_id);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

export const getClassById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  try {
    const classItem = await ClassModel.getById(Number(id), school_id);
    if (!classItem) return res.status(404).json({ error: "Class not found" });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch class" });
  }
};

export const updateClass = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  try {
    const updated = await ClassModel.update(Number(id), name, school_id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update class" });
  }
};

export const deleteClass = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }

  try {
    const result = await ClassModel.delete(Number(id), school_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete class" });
  }
};
