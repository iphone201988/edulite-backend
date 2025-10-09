import express from "express";
import userRouter from "./user.route";
import testQuizRouter from "./testQuiz.route";
import gradeRouter from "./grade.route";
import userResponseRouter from "./userResponse.route";
import creativeProjectRouter from "./creativeProjects.route";
import uploadRoutes from "./upload.router"
import path from "path";
// import userResponseRouter from "./userResponse.route";
const router = express.Router();

router.use("/uploads", express.static(path.join(__dirname, "../../../uploads")));
router.use("/upload", uploadRoutes);
router.use("/auth", userRouter);
router.use("/test-quiz",testQuizRouter)
router.use("/grades",gradeRouter)
router.use("/user-reponse",userResponseRouter)
router.use("/creative-project",creativeProjectRouter)

export default router;