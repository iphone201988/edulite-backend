import express from "express"
import testQuizController from "../controllers/testQuiz.controller"
import authMiddleware from "../middleware/auth.middleware";
import { defaultS3HttpAuthSchemeParametersProvider } from "@aws-sdk/client-s3/dist-types/auth/httpAuthSchemeProvider";
import validate from "../middleware/validate.middleware";
import { getQuizTestByIdValidation, quizTestValidation } from "../validations/testQuiz.validation";
const testQuizRouter = express.Router();

testQuizRouter.post("/",validate(quizTestValidation),authMiddleware,testQuizController.createQuizTest)
testQuizRouter.get("/data",authMiddleware,testQuizController.getFilteredQuizTests)
testQuizRouter.get("/:id",validate(getQuizTestByIdValidation),authMiddleware,testQuizController.getQuizTestById);

export default testQuizRouter


