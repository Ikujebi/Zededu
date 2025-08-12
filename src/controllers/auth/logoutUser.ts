// src/controllers/auth/logoutUser.ts
import { Request, Response } from "express";

let refreshTokens: string[] = [];

export const logoutUser = (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) refreshTokens = refreshTokens.filter((t) => t !== refreshToken);

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logoutUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};
