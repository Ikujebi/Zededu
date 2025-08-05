import express from "express";
import { createSchool } from "../controllers/schoolController";

const router = express.Router();

router.post("/", createSchool);

export default router;
