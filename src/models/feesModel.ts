import pool from "../db";

export const FeeModel = {
  async createFee(name: string, amount: number, description: string, school_id: number) {
    const res = await pool.query(
      `INSERT INTO fees (name, amount, description, school_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, amount, description, school_id]
    );
    return res.rows[0];
  },

  async getFees(school_id: number) {
    const res = await pool.query("SELECT * FROM fees WHERE school_id = $1", [school_id]);
    return res.rows;
  },

  async getFeeById(id: number) {
    const res = await pool.query("SELECT * FROM fees WHERE id = $1", [id]);
    return res.rows[0];
  },

  async updateFee(id: number, name: string, amount: number, description: string) {
    const res = await pool.query(
      `UPDATE fees
       SET name = $1, amount = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [name, amount, description, id]
    );
    return res.rows[0];
  },

  async deleteFee(id: number) {
    await pool.query("DELETE FROM fees WHERE id = $1", [id]);
    return true;
  },
};
