// src/models/teacherModel.ts
import pool from "../db";

export const TeacherModel = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM teachers ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id: number) => {
    const result = await pool.query("SELECT * FROM teachers WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (name: string, email: string, school_id: number, subject: string) => {
    const result = await pool.query(
      "INSERT INTO teachers (name, email, school_id, subject) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, school_id, subject]
    );
    return result.rows[0];
  },

  update: async (
    id: number,
    name: string,
    email: string,
    school_id: number,
    subject: string
  ) => {
    const result = await pool.query(
      "UPDATE teachers SET name = $1, email = $2, school_id = $3, subject = $4 WHERE id = $5 RETURNING *",
      [name, email, school_id, subject, id]
    );
    return result.rows[0];
  },

  delete: async (id: number) => {
    const result = await pool.query("DELETE FROM teachers WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};
