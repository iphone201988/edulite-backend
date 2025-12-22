import express from "express"
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createVideoSchema, updateVideoSchema } from "../validations/video.validation";
import videoController from "../controllers/video.controller";
const videoRouter = express.Router();

videoRouter.post("/", authMiddleware, validate(createVideoSchema), videoController.createVideo)
videoRouter.get("/", authMiddleware, videoController.getAllVideos)
videoRouter.put("/:id", validate(updateVideoSchema), authMiddleware, videoController.updateVideo)
videoRouter.delete("/:id",authMiddleware,authMiddleware,videoController.deleteVideo)

export default videoRouter;

