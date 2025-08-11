// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret";

let refreshTokens: string[] = []; // In production → store in Redis or DB

// Helper functions
const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }); // short-lived
};

const generateRefreshToken = (payload: object) => {
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  refreshTokens.push(token);
  return token;
};

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, school_id } = req.body;

    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, school_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, school_id`,
      [name, email, hashedPassword, role, school_id]
    );

    res.status(201).json({ message: "User registered", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { id: user.rows[0].id, role: user.rows[0].role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "Login successful", accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
    res.json({ accessToken: newAccessToken });
  });
};

// LOGOUT
export const logoutUser = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
