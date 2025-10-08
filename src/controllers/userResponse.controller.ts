import { Request, Response, NextFunction } from "express";
import QuizTestModel from "../models/testQuiz.model";
import UserResponseModel from "../models/userAnswer.model";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { SUCCESS } from "../utils/helpers";
import { successMessages } from "../translations/successMessages.translations";

export const submitUserResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const language = req.language || "en";
    const userId = req.userId;

    const quiz: any = await QuizTestModel.findById(quizId);
    if (!quiz) {
      return next(
        new ErrorHandler(errorMessages[language].NOT_FOUND("Quiz/Test"), 404)
      )
    }

    let correctCount = 0;
    let incorrectCount = 0;

    const processedAnswers = answers.map((ans: any) => {
      const question = quiz.questions.find(q => q._id.toString() === ans.questionId);
      if (!question) {
        return next(
          new ErrorHandler(errorMessages[language].INVALID("Quiz/Test"), 404)
        )
      }

      const isCorrect = question.options.find(opt => opt._id.toString() === ans.selectedOptionId)?.text === question.answer;
      if (isCorrect) correctCount++;
      else incorrectCount++;

      return {
        questionId: ans.questionId,
        selectedOptionId: ans.selectedOptionId,
        isCorrect,
      };
    });

    const type = quiz.type;
    const points = correctCount * 10;

    // ✅ Upsert: update if exists, otherwise create
    const userResponse = await UserResponseModel.findOneAndUpdate(
      { userId, quizId },
      {
        userId,
        quizId,
        type,
        answers: processedAnswers,
        timeTaken,
        points,
        correctCount,
        incorrectCount,
      },
      { new: true, upsert: true, runValidators: true }
    );
    SUCCESS(res, 200, successMessages[language].USER_RESPONSE_SUBMITTED, { userResponse })
  } catch (error) {
    next(error);
  }
};



export default {
  submitUserResponse
}