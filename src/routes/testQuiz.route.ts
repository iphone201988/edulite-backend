import express from "express"
import testQuizController from "../controllers/testQuiz.controller"
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { getQuizTestByIdValidation, quizTestValidation, updateQuizTestValidation } from "../validations/testQuiz.validation";
const testQuizRouter = express.Router();

testQuizRouter.post("/", validate(quizTestValidation), authMiddleware, testQuizController.createQuizTest)
testQuizRouter.get("/data", authMiddleware, testQuizController.getFilteredQuizTests)
testQuizRouter.get("/:id", validate(getQuizTestByIdValidation), authMiddleware, testQuizController.getQuizTestById);
testQuizRouter.post("/:id", validate(updateQuizTestValidation), authMiddleware, testQuizController.updateQuizTest)
testQuizRouter.delete("/:id", authMiddleware, testQuizController.deleteQuizTest)

export default testQuizRouter


