// src/controllers/auth/refreshAccessToken.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret";
let refreshTokens: string[] = [];

const generateAccessToken = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "15m" });

export const refreshAccessToken = (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });
      const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("refreshAccessToken:", err);
    res.status(500).json({ message: "Server error" });
  }
};
