import express from "express"
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import dailyQuestController from "../controllers/dailyQuest.controller";
const dailyQuestRouter = express.Router();

dailyQuestRouter.post("/",authMiddleware,dailyQuestController.createDailyQuest)
dailyQuestRouter.get("/",authMiddleware,dailyQuestController.getDailyQuest);
dailyQuestRouter.get("/admin",authMiddleware,dailyQuestController.getAllDailyQuestsForAdmin)
dailyQuestRouter.delete("/:id",authMiddleware,dailyQuestController.deleteDailyQuest)
dailyQuestRouter.put("/:id",authMiddleware,dailyQuestController.updateDailyQuest)

export default dailyQuestRouter

