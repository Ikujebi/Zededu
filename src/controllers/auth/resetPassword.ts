// src/controllers/auth/resetPassword.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../../db";

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const userRes = await pool.query("SELECT id, reset_token_expiry FROM users WHERE reset_token = $1", [token]);
    if (userRes.rows.length === 0) return res.status(400).json({ message: "Invalid or expired token" });

    const expiry = userRes.rows[0].reset_token_expiry;
    if (!expiry || new Date(expiry) < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      [hashedPassword, userRes.rows[0].id]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};
