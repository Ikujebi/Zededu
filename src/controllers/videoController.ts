// src/controllers/videoController.ts
import { Request, Response } from "express";
import * as VideoModel from "../models/videoModel";
import { createZoomMeeting, createGoogleMeet, createJitsiMeeting } from "../utils/videoApis";

// ===== VIDEO CLASSES =====

export const createVideoClass = async (req: Request, res: Response) => {
  try {
    const { title, start_time, provider, meeting_url, ...rest } = req.body;

    let finalMeetingUrl = meeting_url; // default: frontend-provided link

    // Only generate link if provider supports API
    if (provider === "zoom") {
      finalMeetingUrl = await createZoomMeeting(title, new Date(start_time));
    } else if (provider === "google_meet") {
      finalMeetingUrl = await createGoogleMeet(title, new Date(start_time));
    } else if (provider === "jitsi") {
      finalMeetingUrl = await createJitsiMeeting(title);
    }

    const vc = await VideoModel.createVideoClass({
      ...rest,
      title,
      provider,
      start_time: new Date(start_time),
      meeting_url: finalMeetingUrl,
    });

    res.status(201).json(vc);
  } catch (err) {
    console.error("❌ createVideoClass error:", err);
    res.status(500).json({ error: "Failed to create video class" });
  }
};

export const getAllVideoClasses = async (_req: Request, res: Response) => {
  try {
    const classes = await VideoModel.getAllVideoClasses();
    res.json(classes);
  } catch (err) {
    console.error("❌ getAllVideoClasses error:", err);
    res.status(500).json({ error: "Failed to fetch video classes" });
  }
};

export const getVideoClassById = async (req: Request, res: Response) => {
  try {
    const vc = await VideoModel.getVideoClassById(Number(req.params.id));
    if (!vc) return res.status(404).json({ error: "Video class not found" });
    res.json(vc);
  } catch (err) {
    console.error("❌ getVideoClassById error:", err);
    res.status(500).json({ error: "Failed to fetch video class" });
  }
};

export const updateVideoClass = async (req: Request, res: Response) => {
  try {
    const updated = await VideoModel.updateVideoClass(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Video class not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ updateVideoClass error:", err);
    res.status(500).json({ error: "Failed to update video class" });
  }
};

export const deleteVideoClass = async (req: Request, res: Response) => {
  try {
    const success = await VideoModel.deleteVideoClass(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Video class not found" });
    res.json({ message: "Video class deleted successfully" });
  } catch (err) {
    console.error("❌ deleteVideoClass error:", err);
    res.status(500).json({ error: "Failed to delete video class" });
  }
};

// ===== PARTICIPANTS =====

export const addParticipant = async (req: Request, res: Response) => {
  try {
    const { video_class_id, user_id, role } = req.body;

    // Fetch the video class to determine provider & main link
    const vc = await VideoModel.getVideoClassById(video_class_id);
    if (!vc) return res.status(404).json({ error: "Video class not found" });

    let join_link = vc.meeting_url; // default: main meeting link

    // Generate per-participant join link if provider supports API
    if (vc.provider === "zoom") {
      join_link = await createZoomMeeting(vc.title, vc.start_time);
    } else if (vc.provider === "google_meet") {
      join_link = await createGoogleMeet(vc.title, vc.start_time);
    } else if (vc.provider === "jitsi") {
      join_link = await createJitsiMeeting(vc.title);
    }

    const participant = await VideoModel.addParticipant({
      video_class_id,
      user_id,
      role,
      join_link,
      joined_at: undefined,
      left_at: undefined,
    });

    res.status(201).json(participant);
  } catch (err) {
    console.error("❌ addParticipant error:", err);
    res.status(500).json({ error: "Failed to add participant" });
  }
};

export const getParticipantsByClass = async (req: Request, res: Response) => {
  try {
    const participants = await VideoModel.getParticipantsByClass(Number(req.params.id));
    res.json(participants);
  } catch (err) {
    console.error("❌ getParticipantsByClass error:", err);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};
