import pool from "../db";

export class AssignmentModel {
  static async create(title: string, description: string, due_date: string, class_id: number, created_by: number) {
    const result = await pool.query(
      `INSERT INTO assignments (title, description, due_date, class_id, created_by) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, due_date, class_id, created_by]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(`SELECT * FROM assignments ORDER BY due_date ASC`);
    return result.rows;
  }

  static async getById(id: number) {
    const result = await pool.query(`SELECT * FROM assignments WHERE id = $1`, [id]);
    return result.rows[0];
  }

  static async update(id: number, updates: Partial<{title: string, description: string, due_date: string}>) {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;

    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
    const values = [id, ...Object.values(updates)];

    const result = await pool.query(
      `UPDATE assignments SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id: number) {
    const result = await pool.query(`DELETE FROM assignments WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
  }
}

export class SubmissionModel {
  static async submit(assignment_id: number, student_id: number, content: string) {
    const result = await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, content) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (assignment_id, student_id) 
       DO UPDATE SET content = $3, submitted_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [assignment_id, student_id, content]
    );
    return result.rows[0];
  }

  static async getByAssignment(assignment_id: number) {
    const result = await pool.query(
      `SELECT s.*, u.name as student_name 
       FROM submissions s 
       JOIN users u ON s.student_id = u.id
       WHERE s.assignment_id = $1`,
      [assignment_id]
    );
    return result.rows;
  }
}
