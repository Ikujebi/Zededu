// src/models/receiptModel.ts
import pool from "../db";

export interface Receipt {
  id?: number;
  receipt_number: string;
  student_id: number;
  invoice_id: number;
  payment_id: number;
  amount_paid: number;
  payment_method?: string;
  issued_at?: Date;
  created_by?: number;
  notes?: string;
}

export const createReceipt = async (receipt: Receipt): Promise<Receipt> => {
  const query = `
    INSERT INTO receipts (
      receipt_number, student_id, invoice_id, payment_id, 
      amount_paid, payment_method, created_by, notes
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;

  const values = [
    receipt.receipt_number,
    receipt.student_id,
    receipt.invoice_id,
    receipt.payment_id,
    receipt.amount_paid,
    receipt.payment_method || null,
    receipt.created_by || null,
    receipt.notes || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getReceiptById = async (id: number): Promise<Receipt | null> => {
  const { rows } = await pool.query(`SELECT * FROM receipts WHERE id = $1`, [id]);
  return rows[0] || null;
};

export const getReceiptsByStudent = async (studentId: number): Promise<Receipt[]> => {
  const { rows } = await pool.query(
    `SELECT * FROM receipts WHERE student_id = $1 ORDER BY issued_at DESC`,
    [studentId]
  );
  return rows;
};

export const getAllReceipts = async (): Promise<Receipt[]> => {
  const { rows } = await pool.query(`SELECT * FROM receipts ORDER BY issued_at DESC`);
  return rows;
};
