// controllers/userController.ts
import { Response, Request } from "express";
import pool from "../db";

// Extend Request to include authenticated user data
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    school_id?: number;
  };
}

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "school_admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { userId } = req.params;

    // Ensure user belongs to the same school
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND school_id = $2",
      [userId, req.user.school_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found or not in your school" });
    }

    const result = await pool.query(
      "UPDATE users SET status = 'approved' WHERE id = $1 RETURNING *",
      [userId]
    );

    res.json({ message: "User approved", user: result.rows[0] });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, schoolId, status } = req.query;

    let query = `
      SELECT id, first_name, last_name, email, role, school_id, status, created_at
      FROM users
      WHERE 1 = 1
    `;
    const values: any[] = [];
    let paramIndex = 1;

    if (role) {
      query += ` AND role = $${paramIndex++}`;
      values.push(role);
    }
    if (schoolId) {
      query += ` AND school_id = $${paramIndex++}`;
      values.push(schoolId);
    }
    if (status) {
      query += ` AND status = $${paramIndex++}`;
      values.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);

    res.json({
      message: "Users retrieved successfully",
      users: result.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Super admin can delete anyone
    if (req.user.role === "super_admin") {
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "User deleted successfully" });
    }

    // School admin can only delete users in their own school
    if (req.user.role === "school_admin") {
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 AND school_id = $2 RETURNING *",
        [id, req.user.school_id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or not in your school" });
      }

      return res.json({ message: "User deleted successfully" });
    }

    // Other roles are not allowed
    return res.status(403).json({ message: "Not authorized to delete users" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};