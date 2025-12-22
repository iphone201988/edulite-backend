import express from "express";
import readingController from "../controllers/reading.controller";
import { read } from "fs";
const router = express.Router();

// POST /api/readings
router.post("/", readingController.createReading);
router.get("/",readingController.getReadings)
router.put("/:id",readingController.updateReading)
router.delete("/:id",readingController.deleteReading)

export default router;
