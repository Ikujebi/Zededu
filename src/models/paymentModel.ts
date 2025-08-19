import pool from "../db";

export const PaymentModel = {
  async recordPayment(student_id: number, fee_id: number, amount: number, method: string, status: string, reference: string | null) {
    const res = await pool.query(
      `INSERT INTO payments (student_id, fee_id, amount, method, status, reference)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [student_id, fee_id, amount, method, status, reference]
    );
    return res.rows[0];
  },

  async getPayments() {
    const res = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
    return res.rows;
  },

  async getPaymentById(id: number) {
    const res = await pool.query("SELECT * FROM payments WHERE id = $1", [id]);
    return res.rows[0];
  },

  async getPaymentsByStudent(student_id: number) {
    const res = await pool.query("SELECT * FROM payments WHERE student_id = $1", [student_id]);
    return res.rows;
  },

  async verifyPayment(reference: string) {
    // Placeholder: Call your payment gateway API (Paystack, Flutterwave, Stripe, etc.)
    // For now, we just mark it as verified
    const res = await pool.query(
      `UPDATE payments SET status = 'verified' WHERE reference = $1 RETURNING *`,
      [reference]
    );
    return res.rows[0];
  },
};
