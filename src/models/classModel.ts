import pool from "../db";

export const ClassModel = {
  create: async (name: string, school_id: number) => {
    const result = await pool.query(
      "INSERT INTO classes (name, school_id) VALUES ($1, $2) RETURNING *",
      [name, school_id]
    );
    return result.rows[0];
  },

  getAll: async (school_id: number) => {
    const result = await pool.query(
      "SELECT * FROM classes WHERE school_id = $1",
      [school_id]
    );
    return result.rows;
  },

  getById: async (id: number, school_id: number) => {
    const result = await pool.query(
      "SELECT * FROM classes WHERE id = $1 AND school_id = $2",
      [id, school_id]
    );
    return result.rows[0];
  },

  update: async (id: number, name: string, school_id: number) => {
    const result = await pool.query(
      "UPDATE classes SET name = $1 WHERE id = $2 AND school_id = $3 RETURNING *",
      [name, id, school_id]
    );
    return result.rows[0];
  },

  delete: async (id: number, school_id: number) => {
    await pool.query("DELETE FROM classes WHERE id = $1 AND school_id = $2", [
      id,
      school_id,
    ]);
    return { message: "Class deleted successfully" };
  },
};
