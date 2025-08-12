// src/controllers/auth/forgotPassword.ts
import { Request, Response } from "express";
import crypto from "crypto";
import pool from "../../db";
import { sendEmail } from "../../utils/mailer";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userRes = await pool.query("SELECT id, name FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
      [resetToken, expiry, email]
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const userName = userRes.rows[0].name || "";

    await sendEmail(
      email,
      "Password reset request",
      `<p>Hello ${userName},</p>
       <p>Click the link below to reset your password (valid for 1 hour):</p>
       <p><a href="${resetLink}">${resetLink}</a></p>`
    );

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("forgotPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};
