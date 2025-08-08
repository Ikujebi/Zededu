// src/models/paymentModel.ts
import pool from "../db";

export const PaymentModel = {
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
    const result = await pool.query("SELECT * FROM payments WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (
    student_id: number,
    amount: number,
    payment_date: string,
    method: string,
    status: string
  ) => {
    const result = await pool.query(
      "INSERT INTO payments (student_id, amount, payment_date, method, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [student_id, amount, payment_date, method, status]
    );
    return result.rows[0];
  },

  update: async (
    id: number,
    student_id: number,
    amount: number,
    payment_date: string,
    method: string,
    status: string
  ) => {
    const result = await pool.query(
      "UPDATE payments SET student_id = $1, amount = $2, payment_date = $3, method = $4, status = $5 WHERE id = $6 RETURNING *",
      [student_id, amount, payment_date, method, status, id]
    );
    return result.rows[0];
  },

  delete: async (id: number) => {
    const result = await pool.query("DELETE FROM payments WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};
