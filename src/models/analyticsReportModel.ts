import pool from "../db";

export const AnalyticsReportModel = {
  async getAttendanceReport(schoolId: number) {
    const result = await pool.query(
      `SELECT 
        date,
        COUNT(*) FILTER (WHERE status = 'present') AS present,
        COUNT(*) FILTER (WHERE status = 'absent') AS absent,
        COUNT(*) FILTER (WHERE status = 'late') AS late,
        COUNT(*) FILTER (WHERE status = 'excused') AS excused
      FROM attendance
      JOIN users ON attendance.user_id = users.id
      WHERE users.school_id = $1
      GROUP BY date
      ORDER BY date DESC`,
      [schoolId]
    );
    return result.rows;
  },

  async getResultsReport(schoolId: number) {
    const result = await pool.query(
      `SELECT 
        subjects.name AS subject,
        AVG(score) AS avg_score,
        MIN(score) AS min_score,
        MAX(score) AS max_score
      FROM exam_results
      JOIN exams ON exam_results.exam_id = exams.id
      JOIN subjects ON exams.subject_id = subjects.id
      WHERE exams.school_id = $1
      GROUP BY subjects.name`,
      [schoolId]
    );
    return result.rows;
  },

  async getPaymentsReport(schoolId: number) {
    const result = await pool.query(
      `SELECT 
        status,
        COUNT(*) AS count,
        SUM(amount) AS total_amount
      FROM payments
      WHERE school_id = $1
      GROUP BY status`,
      [schoolId]
    );
    return result.rows;
  },

  async getSchoolPerformance(schoolId: number) {
    const result = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM users WHERE school_id = $1 AND role = 'student') AS total_students,
        (SELECT COUNT(*) FROM classes WHERE school_id = $1) AS total_classes,
        (SELECT COUNT(*) FROM subjects WHERE school_id = $1) AS total_subjects,
        (SELECT COUNT(*) FROM exams WHERE school_id = $1) AS total_exams,
        (SELECT COUNT(*) FROM assignments WHERE class_id IN (SELECT id FROM classes WHERE school_id = $1)) AS total_assignments`,
      [schoolId]
    );
    return result.rows[0];
  },

  async getAppPerformance() {
    const result = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM schools) AS total_schools,
        (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'teacher') AS total_teachers,
        (SELECT COUNT(*) FROM classes) AS total_classes,
        (SELECT COUNT(*) FROM exams) AS total_exams,
        (SELECT COUNT(*) FROM payments) AS total_payments
      `
    );
    return result.rows[0];
  },
};
