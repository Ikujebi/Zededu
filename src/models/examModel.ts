// src/models/examModel.ts
import pool from "../db";

// Define the TypeScript type (shape of the exam record)
export interface Exam {
  id?: number;
  title: string;
  subject: string;
  date: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Create a new exam
export const createExam = async (exam: Exam) => {
  const { title, subject, date } = exam;
  const result = await pool.query(
    `INSERT INTO exams (title, subject, date, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     RETURNING *`,
    [title, subject, date]
  );
  return result.rows[0];
};

// Get all exams
export const getAllExams = async (): Promise<Exam[]> => {
  const result = await pool.query(`SELECT * FROM exams ORDER BY date ASC`);
  return result.rows;
};

// Get exam by id
export const getExamById = async (id: number): Promise<Exam | null> => {
  const result = await pool.query(`SELECT * FROM exams WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

// Update exam
export const updateExam = async (id: number, exam: Partial<Exam>) => {
  const { title, subject, date } = exam;
  const result = await pool.query(
    `UPDATE exams 
     SET title = COALESCE($1, title),
         subject = COALESCE($2, subject),
         date = COALESCE($3, date),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, subject, date, id]
  );
  return result.rows[0];
};

// Delete exam
export const deleteExam = async (id: number) => {
  await pool.query(`DELETE FROM exams WHERE id = $1`, [id]);
  return { message: "Exam deleted successfully" };
};
