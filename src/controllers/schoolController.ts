import { Request, Response } from "express";
import pool from "../db";
import { AuthRequest } from "../middlewares/authMiddleware";

// CREATE school (defaults to pending until super admin approves)
export const createSchool = async (req: Request, res: Response) => {
  const { name, address, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO schools (name, address, email, status) 
       VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [name, address, email]
    );

    res.status(201).json({
      message: "School created and pending approval from super admin",
      school: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating school:", err);
    res.status(500).json({ error: "Could not create school" });
  }
};

// READ - Get all schools (optional: filter by status)
export const getSchools = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    let query = "SELECT * FROM schools";
    const params: any[] = [];

    if (status) {
      query += " WHERE status = $1";
      params.push(status);
    }

    query += " ORDER BY id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching schools:", err);
    res.status(500).json({ error: "Could not fetch schools" });
  }
};

// READ - Get a single school by ID
export const getSchoolById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM schools WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching school:", err);
    res.status(500).json({ error: "Could not fetch school" });
  }
};

// UPDATE school details
export const updateSchool = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, email } = req.body;

  try {
    const result = await pool.query(
      "UPDATE schools SET name = $1, address = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, address, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating school:", err);
    res.status(500).json({ error: "Could not update school" });
  }
};

// DELETE school
export const deleteSchool = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM schools WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "School not found" });
    }

    res.json({ message: "School deleted successfully" });
  } catch (err) {
    console.error("Error deleting school:", err);
    res.status(500).json({ error: "Could not delete school" });
  }
};

// SUPER ADMIN approves school
export const approveSchool = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { schoolId } = req.params;

    const result = await pool.query(
      "UPDATE schools SET status = 'approved' WHERE id = $1 RETURNING *",
      [schoolId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json({ message: "School approved", school: result.rows[0] });
  } catch (error) {
    console.error("Error approving school:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSchoolSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { term_dates, fees, logo_url } = req.body;

    // Authorization: Only super_admin or that school's admin can update
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.school_id === parseInt(id))
    ) {
      return res.status(403).json({ message: "Not authorized to update this school's settings" });
    }

    // Update the settings
    const result = await pool.query(
      `UPDATE schools 
       SET term_dates = $1, fees = $2, logo_url = $3, updated_at = NOW()
       WHERE id = $4 
       RETURNING *`,
      [term_dates, fees, logo_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json({
      message: "School settings updated successfully",
      school: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating school settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
