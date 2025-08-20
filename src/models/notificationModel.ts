// src/models/notificationModel.ts
import pool from "../db";

export interface Notification {
  id?: number;
  recipient_id: number;
  sender_id?: number | null;
  type: string; // e.g. "exam", "assignment", "payment"
  title: string;
  message: string;
  is_read?: boolean;
  created_at?: Date;
}

// ============================
// DB QUERIES
// ============================
export const NotificationModel = {
  // Create a new notification
  async create(notification: Notification): Promise<Notification> {
    const { recipient_id, sender_id, type, title, message } = notification;

    const result = await pool.query(
      `INSERT INTO notifications (recipient_id, sender_id, type, title, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [recipient_id, sender_id || null, type, title, message]
    );

    return result.rows[0];
  },

  // Get all notifications for a user
  async getByRecipient(recipient_id: number): Promise<Notification[]> {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE recipient_id = $1
       ORDER BY created_at DESC`,
      [recipient_id]
    );
    return result.rows;
  },

  // Mark a notification as read
  async markAsRead(id: number): Promise<Notification> {
    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // Delete a notification
  async delete(id: number): Promise<void> {
    await pool.query(`DELETE FROM notifications WHERE id = $1`, [id]);
  },
};
