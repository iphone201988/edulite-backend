import express from "express";
import userRouter from "./user.route";
import testQuizRouter from "./testQuiz.route";
import gradeRouter from "./grade.route";
import userResponseRouter from "./userResponse.route";
import creativeProjectRouter from "./creativeProjects.route";
import uploadRoutes from "./upload.router"
import ReadingRoutes from "./reading.route";
import path from "path";
import dailyQuestRouter from "./dailyQuest.route";
import adminController from "../controllers/admin.controller";
import adminRouter from "./admin.route";
import prizeRouter from "./prizes.route";
import videoRouter from "./video.route";
const router = express.Router();

router.use("/uploads", express.static(path.join(__dirname, "../../../../uploads")));
router.use("/upload", uploadRoutes);
router.use("/auth", userRouter);
router.use("/test-quiz",testQuizRouter)
router.use("/grades",gradeRouter)
router.use("/user-reponse",userResponseRouter)
router.use("/creative-project",creativeProjectRouter)
router.use("/reading",ReadingRoutes)
router.use("/daily-quest",dailyQuestRouter)
router.use("/admin",adminRouter)
router.use("/prize",prizeRouter)
router.use("/video",videoRouter)

export default router;