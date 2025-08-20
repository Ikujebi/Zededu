// src/routes/videoRoutes.ts
import { Router } from "express";
import * as VideoController from "../controllers/videoController";

const router = Router();

// Video classes
router.post("/video-classes", VideoController.createVideoClass);
router.get("/video-classes", VideoController.getAllVideoClasses);
router.get("/video-classes/:id", VideoController.getVideoClassById);
router.patch("/video-classes/:id", VideoController.updateVideoClass);
router.delete("/video-classes/:id", VideoController.deleteVideoClass);

// Participants
router.post("/video-classes/:id/participants", VideoController.addParticipant);
router.get("/video-classes/:id/participants", VideoController.getParticipantsByClass);

export default router;
