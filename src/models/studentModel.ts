import pool from "../db";


export const StudentModel = {
  getAll: async (filters?: {
    name?: string;
    class_name?: string;
    school_id?: number;
    status?: string;
  }) => {
    let query = "SELECT * FROM students WHERE 1=1";
    const values: any[] = [];
    let idx = 1;

    if (filters?.name) {
      query += ` AND name ILIKE $${idx++}`;
      values.push(`%${filters.name}%`); // partial match
    }

    if (filters?.class_name) {
      query += ` AND class_name = $${idx++}`;
      values.push(filters.class_name);
    }

    if (filters?.school_id) {
      query += ` AND school_id = $${idx++}`;
      values.push(filters.school_id);
    }

    if (filters?.status) {
      query += ` AND status = $${idx++}`;
      values.push(filters.status);
    }

    query += " ORDER BY id ASC";

    const result = await pool.query(query, values);
    return result.rows;
  },

  getById: async (id: number) => {
    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );
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
    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
};
