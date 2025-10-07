import express from "express"
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import gradesController from "../controllers/grades.controller";
import { addGradeSchema } from "../validations/testQuiz.validation";
const gradeRouter = express.Router();

gradeRouter.post("/",authMiddleware,validate(addGradeSchema),gradesController.addGrade)
gradeRouter.get("/",authMiddleware,gradesController.getAllGrades)
gradeRouter.get("/:id",authMiddleware,gradesController.getGradeById)
export default gradeRouter

