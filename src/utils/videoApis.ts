// src/utils/videoApis.ts
import axios from "axios";

// Zoom API example
export const createZoomMeeting = async (title: string, startTime: Date) => {
  const ZOOM_JWT = process.env.ZOOM_JWT;
  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: title,
      type: 2, // scheduled meeting
      start_time: startTime.toISOString(),
    },
    {
      headers: {
        Authorization: `Bearer ${ZOOM_JWT}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.join_url;
};

// Google Meet: placeholder (Google Workspace API required)
export const createGoogleMeet = async (title: string, startTime: Date) => {
  // TODO: call Google Calendar API to create a Meet link
  return `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}`;
};

// Jitsi: usually just generate a random room name
export const createJitsiMeeting = async (title: string) => {
  return `https://meet.jit.si/${encodeURIComponent(title)}-${Date.now()}`;
};
