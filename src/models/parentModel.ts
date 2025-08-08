// src/models/parentModel.ts
import pool from "../db";

export const ParentModel = {
  getAll: async (studentId?: number) => {
  let query = "SELECT * FROM payments";
  const params: any[] = [];

  if (studentId) {
    query += " WHERE student_id = $1";
    params.push(studentId);
  }

  query += " ORDER BY id ASC";
  const result = await pool.query(query, params);
  return result.rows;
},

  getById: async (id: number) => {
    const result = await pool.query("SELECT * FROM parents WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (name: string, email: string, phone: string, student_id: number) => {
    const result = await pool.query(
      "INSERT INTO parents (name, email, phone, student_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, student_id]
    );
    return result.rows[0];
  },

  update: async (id: number, name: string, email: string, phone: string, student_id: number) => {
    const result = await pool.query(
      "UPDATE parents SET name = $1, email = $2, phone = $3, student_id = $4 WHERE id = $5 RETURNING *",
      [name, email, phone, student_id, id]
    );
    return result.rows[0];
  },

  delete: async (id: number) => {
    const result = await pool.query("DELETE FROM parents WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};
