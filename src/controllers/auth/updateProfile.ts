import { Response } from "express";
import pool from "../../db";
import { AuthRequest } from "../../middlewares/authMiddleware";

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, email, phone } = req.body;

    // Prevent empty updates
    if (!name && !email && !phone) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           phone = COALESCE($3, phone) 
       WHERE id = $4 
       RETURNING id, name, email, phone, role, school_id`,
      [name || null, email || null, phone || null, req.user.id]
    );

    res.json({ message: "Profile updated", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
