import { Response } from "express";
import { SubjectModel } from "../models/subjectModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createSubject = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }
  try {
    const subject = await SubjectModel.create(name, school_id);
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: "Failed to create subject" });
  }
};

export const getSubjects = async (req: AuthRequest, res: Response) => {
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }
  try {
    const subjects = await SubjectModel.getAll(school_id);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

export const updateSubject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }
  try {
    const updated = await SubjectModel.update(Number(id), name, school_id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update subject" });
  }
};

export const deleteSubject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const school_id = req.user?.school_id;

  if (!school_id) {
    return res.status(400).json({ error: "School ID is required" });
  }
  try {
    const result = await SubjectModel.delete(Number(id), school_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete subject" });
  }
};
