// src/controllers/messageController.ts
import { Request, Response } from "express";
import { MessageModel } from "../models/messageModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// Send a new message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const sender_id = req.user?.id;
    const { receiver_id, content } = req.body;

    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const message = await MessageModel.createMessage({
      sender_id,
      receiver_id,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get all messages for logged-in user
export const getMessagesForUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const messages = await MessageModel.getMessagesForUser(userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Get conversation between two users
export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { userId: otherUserId } = req.params;

    if (!userId || !otherUserId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const conversation = await MessageModel.getConversation(
      userId,
      Number(otherUserId)
    );
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

// Mark a message as read
export const markMessageAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const messageId = Number(req.params.id);

    if (!userId) return res.status(400).json({ error: "User ID required" });

    const message = await MessageModel.markMessageAsRead(messageId, userId);
    if (!message)
      return res.status(404).json({ error: "Message not found or unauthorized" });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark message as read" });
  }
};

// Delete a message
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const messageId = Number(req.params.id);

    if (!userId) return res.status(400).json({ error: "User ID required" });

    const message = await MessageModel.deleteMessage(messageId, userId);
    if (!message)
      return res.status(404).json({ error: "Message not found or unauthorized" });

    res.json({ success: true, deleted: message });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
