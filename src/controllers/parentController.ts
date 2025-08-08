// src/controllers/parentController.ts
import { Request, Response } from "express";
import { ParentModel } from "../models/parentModel";

// CREATE
export const createParent = async (req: Request, res: Response) => {
  const { name, email, phone, student_id } = req.body;

  try {
    const parent = await ParentModel.create(name, email, phone, student_id);
    res.status(201).json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create parent" });
  }
};

// READ - All
export const getParents = async (_req: Request, res: Response) => {
  try {
    const parents = await ParentModel.getAll();
    res.json(parents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch parents" });
  }
};

// READ - One
export const getParentById = async (req: Request, res: Response) => {
  try {
    const parent = await ParentModel.getById(Number(req.params.id));
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }
    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch parent" });
  }
};

// UPDATE
export const updateParent = async (req: Request, res: Response) => {
  const { name, email, phone, student_id } = req.body;

  try {
    const updatedParent = await ParentModel.update(
      Number(req.params.id),
      name,
      email,
      phone,
      student_id
    );

    if (!updatedParent) {
      return res.status(404).json({ error: "Parent not found" });
    }
    res.json(updatedParent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update parent" });
  }
};

// DELETE
export const deleteParent = async (req: Request, res: Response) => {
  try {
    const deleted = await ParentModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: "Parent not found" });
    }
    res.json({ message: "Parent deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete parent" });
  }
};
