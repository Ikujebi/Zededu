import { Request, Response } from "express";
import { AttendanceModel } from "../models/attendanceModel";

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { user_id, status, date } = req.body;

    if (!user_id || !status) {
      return res.status(400).json({ error: "user_id and status are required" });
    }

    const attendance = await AttendanceModel.mark(user_id, status, 1, undefined, date);
    res.status(201).json(attendance);
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ error: "Could not mark attendance" });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, role } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const attendance = await AttendanceModel.getByDateRange(
      String(startDate),
      String(endDate),
      role ? (String(role) as "student" | "staff") : undefined
    );

    res.status(200).json(attendance);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Could not fetch attendance" });
  }
};

// ✅ GET /attendance/:id
export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attendance = await AttendanceModel.getById(Number(id));

    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.json(attendance);
  } catch (err) {
    console.error("Error fetching attendance by ID:", err);
    res.status(500).json({ error: "Could not fetch attendance" });
  }
};

// ✅ PATCH /attendance/:id
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, date } = req.body;

    const attendance = await AttendanceModel.update(Number(id), status, date);

    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.json(attendance);
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ error: "Could not update attendance" });
  }
};

// ✅ DELETE /attendance/:id
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const attendance = await AttendanceModel.delete(Number(id));

    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted", attendance });
  } catch (err) {
    console.error("Error deleting attendance:", err);
    res.status(500).json({ error: "Could not delete attendance" });
  }
};
