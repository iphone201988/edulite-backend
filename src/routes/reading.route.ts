import express from "express";
import readingController from "../controllers/reading.controller";
import authMiddleware from "../middleware/auth.middleware";
import { updateReadingProgressSchema } from "../validations/reading.validation";
import validate from "../middleware/validate.middleware";
const router = express.Router();

router.put("/progress",authMiddleware,validate(updateReadingProgressSchema),readingController.updateReadingProgress)
router.post("/",authMiddleware, readingController.createReading);
router.get("/",authMiddleware,readingController.getReadings)
router.get("/:id",authMiddleware,readingController.getReadingById)
router.put("/:id",authMiddleware,readingController.updateReading)
router.delete("/:id",authMiddleware,readingController.deleteReading)

export default router;
