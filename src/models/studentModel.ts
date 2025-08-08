// src/models/studentModel.ts
import pool from "../db";

export const StudentModel = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id: number) => {
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (name: string, email: string, school_id: number, class_name: string) => {
    const result = await pool.query(
      "INSERT INTO students (name, email, school_id, class_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, school_id, class_name]
    );
    return result.rows[0];
  },

  update: async (id: number, name: string, email: string, school_id: number, class_name: string) => {
    const result = await pool.query(
      "UPDATE students SET name = $1, email = $2, school_id = $3, class_name = $4 WHERE id = $5 RETURNING *",
      [name, email, school_id, class_name, id]
    );
    return result.rows[0];
  },

  delete: async (id: number) => {
    const result = await pool.query("DELETE FROM students WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};
