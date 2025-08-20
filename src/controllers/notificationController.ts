// src/controllers/notificationController.ts
import { Response } from "express";
import { NotificationModel } from "../models/notificationModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// ============================
// Create Notification
// ============================
export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { recipient_id, type, title, message } = req.body;
    const sender_id = req.user?.id || null;

    if (!recipient_id || !type || !title || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const notification = await NotificationModel.create({
      recipient_id,
      sender_id,
      type,
      title,
      message,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Get Notifications for User
// ============================
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const notifications = await NotificationModel.getByRecipient(userId);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Mark Notification as Read
// ============================
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await NotificationModel.markAsRead(Number(id));
    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Delete Notification
// ============================
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await NotificationModel.delete(Number(id));
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Server error" });
  }
};
