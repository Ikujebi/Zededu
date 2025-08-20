import { Router } from "express";
import { createNotification, getNotifications, markAsRead } from "../controllers/notificationController";

const router = Router();

router.post("/", createNotification);
router.get("/:userId", getNotifications);
router.patch("/:id/read", markAsRead);

export default router;
