import pool from "../db";

export const SubjectModel = {
  create: async (name: string, school_id: number) => {
    const result = await pool.query(
      "INSERT INTO subjects (name, school_id) VALUES ($1, $2) RETURNING *",
      [name, school_id]
    );
    return result.rows[0];
  },

  getAll: async (school_id: number) => {
    const result = await pool.query(
      "SELECT * FROM subjects WHERE school_id = $1",
      [school_id]
    );
    return result.rows;
  },

  update: async (id: number, name: string, school_id: number) => {
    const result = await pool.query(
      "UPDATE subjects SET name = $1 WHERE id = $2 AND school_id = $3 RETURNING *",
      [name, id, school_id]
    );
    return result.rows[0];
  },

  delete: async (id: number, school_id: number) => {
    await pool.query("DELETE FROM subjects WHERE id = $1 AND school_id = $2", [
      id,
      school_id,
    ]);
    return { message: "Subject deleted successfully" };
  },
};
