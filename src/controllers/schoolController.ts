import { Request, Response } from "express";
import pool from "../db";

// CREATE school
export const createSchool = async (req: Request, res: Response) => {
  const { name, address, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO schools (name, address, email) VALUES ($1, $2, $3) RETURNING *",
      [name, address, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create school" });
  }
};

// READ - Get all schools
export const getSchools = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM schools ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch schools" });
  }
};

// READ - Get a single school by ID
export const getSchoolById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM schools WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch school" });
  }
};

// UPDATE school
export const updateSchool = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, email } = req.body;

  try {
    const result = await pool.query(
      "UPDATE schools SET name = $1, address = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, address, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update school" });
  }
};

// DELETE school
export const deleteSchool = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM schools WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    res.json({ message: "School deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete school" });
  }
};
