import pool from "../db";

export interface VideoClass {
  id?: number;
  school_id: number;
  class_id?: number;
  created_by: number;
  title: string;
  description?: string;
  provider: "zoom" | "google_meet" | "jitsi" | "other";
  meeting_url?: string; // <- now optional
  start_time: Date;
  end_time?: Date;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
  created_at?: Date;
  updated_at?: Date;
}

export interface VideoClassParticipant {
  id?: number;
  video_class_id: number;
  user_id: number;
  role?: "teacher" | "student" | "parent";
  join_link?: string;
  joined_at?: Date;
  left_at?: Date;
}

// ========== VIDEO CLASSES ==========

export const createVideoClass = async (vc: VideoClass) => {
  const {
    school_id,
    class_id,
    created_by,
    title,
    description,
    provider,
    meeting_url,
    start_time,
    end_time,
    status,
  } = vc;

  const result = await pool.query(
    `INSERT INTO video_classes 
     (school_id, class_id, created_by, title, description, provider, meeting_url, start_time, end_time, status, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
     RETURNING *`,
    [school_id, class_id, created_by, title, description || null, provider, meeting_url || null, start_time, end_time || null, status || 'scheduled']
  );

  return result.rows[0];
};

export const getAllVideoClasses = async (): Promise<VideoClass[]> => {
  const result = await pool.query(`SELECT * FROM video_classes ORDER BY start_time ASC`);
  return result.rows;
};

export const getVideoClassById = async (id: number): Promise<VideoClass | null> => {
  const result = await pool.query(`SELECT * FROM video_classes WHERE id=$1`, [id]);
  return result.rows[0] || null;
};

export const updateVideoClass = async (id: number, updates: Partial<VideoClass>) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return null;

  const setClause = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");
  const query = `UPDATE video_classes SET ${setClause}, updated_at=NOW() WHERE id=$${fields.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0] || null;
};

export const deleteVideoClass = async (id: number): Promise<boolean> => {
  const result = await pool.query(`DELETE FROM video_classes WHERE id=$1`, [id]);
  return (result.rowCount ?? 0) > 0;
};

// ========== VIDEO CLASS PARTICIPANTS ==========

export const addParticipant = async (p: VideoClassParticipant) => {
  const { video_class_id, user_id, role, join_link, joined_at, left_at } = p;
  const result = await pool.query(
    `INSERT INTO video_class_participants
     (video_class_id, user_id, role, join_link, joined_at, left_at)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [video_class_id, user_id, role, join_link, joined_at, left_at]
  );
  return result.rows[0];
};

export const getParticipantsByClass = async (video_class_id: number) => {
  const result = await pool.query(
    `SELECT * FROM video_class_participants WHERE video_class_id=$1`,
    [video_class_id]
  );
  return result.rows;
};
