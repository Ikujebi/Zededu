// src/models/invoiceModel.ts
import pool from "../db";

export const InvoiceModel = {
  async createInvoice(school_id: number, student_id: number, due_date: string, items: { fee_id?: number, description: string, amount: number }[]) {
    // Calculate total
    const total_amount = items.reduce((sum, i) => sum + Number(i.amount), 0);

    // Create invoice
    const invoiceRes = await pool.query(
      `INSERT INTO invoices (school_id, student_id, total_amount, due_date, status)
       VALUES ($1, $2, $3, $4, 'unpaid')
       RETURNING *`,
      [school_id, student_id, total_amount, due_date]
    );

    const invoice = invoiceRes.rows[0];

    // Insert invoice items
    for (const item of items) {
      await pool.query(
        `INSERT INTO invoice_items (invoice_id, fee_id, description, amount)
         VALUES ($1, $2, $3, $4)`,
        [invoice.id, item.fee_id ?? null, item.description, item.amount]
      );
    }

    return invoice;
  },

  async getInvoicesByStudent(student_id: number) {
    const res = await pool.query(
      `SELECT * FROM invoices WHERE student_id = $1 ORDER BY created_at DESC`,
      [student_id]
    );
    return res.rows;
  },

  async getInvoiceById(id: number) {
    const invoiceRes = await pool.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
    if (invoiceRes.rows.length === 0) return null;

    const itemsRes = await pool.query(`SELECT * FROM invoice_items WHERE invoice_id = $1`, [id]);

    return {
      ...invoiceRes.rows[0],
      items: itemsRes.rows,
    };
  },

  async updateInvoiceStatus(id: number, status: "unpaid" | "partial" | "paid") {
    const res = await pool.query(
      `UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return res.rows[0];
  },

  async deleteInvoice(id: number) {
    await pool.query("DELETE FROM invoices WHERE id = $1", [id]);
    return true;
  },
};
