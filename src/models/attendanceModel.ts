import pool from "../db";

export interface Attendance {
  id: number;
  userId: number;      // student or staff
  schoolId: number;    // easier filtering
  classId?: number;    // if student belongs to class
  status: "present" | "absent" | "late";
  date: Date;          // attendance date
  createdAt: Date;     // timestamp
}

export const AttendanceModel = {
  mark: async (
    user_id: number,
    status: string,
    school_id: number,
    class_id?: number,
    date?: string
  ) => {
    const result = await pool.query(
      `
      INSERT INTO attendance (user_id, status, date)
      VALUES ($1, $2, COALESCE($3, CURRENT_DATE))
      ON CONFLICT (user_id, date)
      DO UPDATE SET status = EXCLUDED.status
      RETURNING *;
      `,
      [user_id, status, date]
    );
    return result.rows[0] as Attendance;
  },

  getByUser: async (user_id: number): Promise<Attendance[]> => {
    const result = await pool.query(
      `SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC`,
      [user_id]
    );
    return result.rows as Attendance[];
  },

  getByDate: async (date: string): Promise<Attendance[]> => {
    const result = await pool.query(
      `SELECT * FROM attendance WHERE date = $1`,
      [date]
    );
    return result.rows as Attendance[];
  },

  getByDateRange: async (
    startDate: string,
    endDate: string,
    role?: "student" | "staff"
  ) => {
    let query = `
      SELECT a.*, u.name, u.role
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.date BETWEEN $1 AND $2
    `;
    const params: any[] = [startDate, endDate];

    if (role) {
      query += ` AND u.role = $3`;
      params.push(role);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  // ✅ NEW: Get attendance by record ID
  getById: async (id: number) => {
    const result = await pool.query(
      `SELECT * FROM attendance WHERE id = $1`,
      [id]
    );
    return result.rows[0] as Attendance | null;
  },

  // ✅ NEW: Update attendance by record ID
  update: async (id: number, status?: string, date?: string) => {
    const result = await pool.query(
      `
      UPDATE attendance
      SET status = COALESCE($2, status),
          date = COALESCE($3, date)
      WHERE id = $1
      RETURNING *;
      `,
      [id, status, date]
    );
    return result.rows[0] as Attendance | null;
  },

  // ✅ NEW: Delete attendance by record ID
  delete: async (id: number) => {
    const result = await pool.query(
      `DELETE FROM attendance WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0] as Attendance | null;
  }
};
