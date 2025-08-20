// src/routes/messageRoutes.ts
import { Router } from "express";
import {
  sendMessage,
  getMessagesForUser,
  getConversation,
  markMessageAsRead,
  deleteMessage,
} from "../controllers/messageController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

// Send a message
router.post("/", authenticateUser, sendMessage);

// Get all messages for logged-in user
router.get("/", authenticateUser, getMessagesForUser);

// Get conversation between logged-in user and another user
router.get("/conversation/:userId", authenticateUser, getConversation);

// Mark a message as read
router.patch("/:id/read", authenticateUser, markMessageAsRead);

// Delete a message
router.delete("/:id", authenticateUser, deleteMessage);

export default router;
