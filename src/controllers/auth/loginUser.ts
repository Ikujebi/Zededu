// src/controllers/auth/loginUser.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../db";
import { sendEmail } from "../../utils/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret";

let refreshTokens: string[] = [];

const generateAccessToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (payload: object) => {
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  refreshTokens.push(token);
  return token;
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRes = await pool.query(
      "SELECT id, role, school_id, name, email, password FROM users WHERE email = $1",
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Include school_id in the token payload
    const payload = { 
      id: user.id, 
      role: user.role, 
      school_id: user.school_id 
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

    try {
      await sendEmail(
        user.email,
        "New login to your account",
        `<p>Hello ${user.name || ""},</p>
         <p>Your account was just used to sign in at ${new Date().toLocaleString()}.</p>
         <p>If this wasn't you, please reset your password or contact support.</p>`
      );
    } catch (emailErr) {
      console.warn("login email failed:", emailErr);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ 
      message: "Login successful", 
      accessToken,
      user: {
        id: user.id,
        role: user.role,
        school_id: user.school_id
      }
    });
  } catch (err) {
    console.error("loginUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};
