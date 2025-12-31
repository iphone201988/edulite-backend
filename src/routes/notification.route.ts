import express from "express"
import authMiddleware from "../middleware/auth.middleware";
import notificationController from "../controllers/notification.controller";
const notificationRouter = express.Router();

notificationRouter.get("/",authMiddleware,notificationController.getNotifications)
notificationRouter.get("/unread-count",authMiddleware,notificationController.getUnreadCount)    
notificationRouter.post("/send",authMiddleware,notificationController.sendNotification)
notificationRouter.post("/:notificationId",authMiddleware,notificationController.markAsRead)
export default notificationRouter