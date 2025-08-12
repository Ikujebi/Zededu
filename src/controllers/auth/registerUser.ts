// src/controllers/auth/registerUser.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../../db";
import { sendEmail } from "../../utils/mailer";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, school_id } = req.body;
    const allowedRoles = ["super_admin", "school_admin", "teacher", "student", "parent"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, school_id, verification_token)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, name, email, role, school_id`,
      [name, email, hashedPassword, role, school_id, verificationToken]
    );

    const verifyLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `<p>Hello ${name},</p>
       <p>Thanks for signing up. Click the link below to verify your email:</p>
       <p><a href="${verifyLink}">${verifyLink}</a></p>
       <p>If you didn't request this, ignore this email.</p>`
    );

    res.status(201).json({ message: "User registered. Verification email sent.", user: result.rows[0] });
  } catch (err) {
    console.error("registerUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};
