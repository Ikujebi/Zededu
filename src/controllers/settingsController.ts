// src/controllers/settingsController.ts
import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { SettingsModel } from "../models/settingsModel";

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.school_id || undefined;
    const settings = await SettingsModel.getSettings(schoolId);
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.school_id || null;
    const updates = req.body; // { theme: "dark", language: "en" }

    const results = [];
    for (const [key, value] of Object.entries(updates)) {
      const updated = await SettingsModel.updateSetting(schoolId, key, String(value));
      results.push(updated);
    }

    res.json(results);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};
