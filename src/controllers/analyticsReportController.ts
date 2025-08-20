import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { AnalyticsReportModel } from "../models/analyticsReportModel";

export const getAttendanceReport = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ error: "School ID required" });

    const report = await AnalyticsReportModel.getAttendanceReport(schoolId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance report" });
  }
};

export const getResultsReport = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ error: "School ID required" });

    const report = await AnalyticsReportModel.getResultsReport(schoolId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results report" });
  }
};

export const getPaymentsReport = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ error: "School ID required" });

    const report = await AnalyticsReportModel.getPaymentsReport(schoolId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments report" });
  }
};

export const getSchoolPerformance = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(400).json({ error: "School ID required" });

    const report = await AnalyticsReportModel.getSchoolPerformance(schoolId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch school performance" });
  }
};

export const getAppPerformance = async (_req: AuthRequest, res: Response) => {
  try {
    const report = await AnalyticsReportModel.getAppPerformance();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch app performance" });
  }
};
