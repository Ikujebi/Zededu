import { Request, Response } from "express";
import pool from "../db";

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
