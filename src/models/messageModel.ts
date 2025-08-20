// src/models/MessageModel.ts
import { Pool } from "pg";
import pool from "../db";

export interface Message {
  id?: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read?: boolean;
  created_at?: Date;
}

export class MessageModel {
  static async createMessage(message: Message) {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, is_read, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const values = [
      message.sender_id,
      message.receiver_id,
      message.content,
      false,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getMessagesForUser(userId: number) {
    const query = `
      SELECT * FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async getConversation(userId: number, otherUserId: number) {
    const query = `
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC;
    `;
    const { rows } = await pool.query(query, [userId, otherUserId]);
    return rows;
  }

  static async markMessageAsRead(messageId: number, userId: number) {
    const query = `
      UPDATE messages
      SET is_read = true
      WHERE id = $1 AND receiver_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [messageId, userId]);
    return rows[0];
  }

  static async deleteMessage(messageId: number, userId: number) {
    const query = `
      DELETE FROM messages
      WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [messageId, userId]);
    return rows[0];
  }
}
