// src/controllers/auth/verifyEmail.ts
import { Request, Response } from "express";
import pool from "../../db";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).json({ message: "Token required" });

    const userRes = await pool.query("SELECT id FROM users WHERE verification_token = $1", [token]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const userId = userRes.rows[0].id;
    await pool.query(
      "UPDATE users SET email_verified = true, verification_token = NULL WHERE id = $1",
      [userId]
    );

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyEmail:", err);
    res.status(500).json({ message: "Server error" });
  }
};
