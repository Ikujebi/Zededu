// src/models/resultModel.ts
import pool from "../db";

export interface Result {
  id?: number;
  examId: number;
  studentId: number;
  score: number;
}

// Create Result
export const createResult = async (result: Result): Promise<Result> => {
  const { examId, studentId, score } = result;
  const query = `
    INSERT INTO results (exam_id, student_id, score)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [examId, studentId, score];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get all Results
export const getAllResults = async (): Promise<Result[]> => {
  const query = `SELECT * FROM results;`;
  const { rows } = await pool.query(query);
  return rows;
};

// Get Result by ID
export const getResultById = async (id: number): Promise<Result | null> => {
  const query = `SELECT * FROM results WHERE id = $1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

// Update Result
export const updateResult = async (id: number, updates: Partial<Result>): Promise<Result | null> => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return null;

  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");
  const query = `
    UPDATE results
    SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [...values, id]);
  return rows[0] || null;
};

// Delete Result
export const deleteResult = async (id: number): Promise<boolean> => {
  const query = `DELETE FROM results WHERE id = $1;`;
  const { rowCount } = await pool.query(query, [id]);
  return (rowCount ?? 0) > 0;
};
