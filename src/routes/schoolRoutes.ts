import express from "express";
import {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} from "../controllers/schoolController";

const router = express.Router();

// Create a new school
router.post("/", createSchool);

// Get all schools
router.get("/", getSchools);

// Get a single school by ID
router.get("/:id", getSchoolById);

// Update a school by ID
router.put("/:id", updateSchool);

// Delete a school by ID
router.delete("/:id", deleteSchool);

export default router;
