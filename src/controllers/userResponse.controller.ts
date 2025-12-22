import { Request, Response, NextFunction } from "express";
import QuizTestModel from "../models/testQuiz.model";
import UserResponseModel from "../models/userAnswer.model";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { SUCCESS } from "../utils/helpers";
import { successMessages } from "../translations/successMessages.translations";
import { checkAndAssignQuizPrizes } from "../services/prize.service";

export const submitUserResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quizId, answers, timeTaken, status } = req.body;
    const language = req.language || "en";
    const userId = req.userId;

    const quiz: any = await QuizTestModel.findById(quizId);
    if (!quiz) {
      return next(
        new ErrorHandler(errorMessages[language].NOT_FOUND("Quiz/Test"), 404)
      );
    }

    let correctCount = 0;
    let incorrectCount = 0;

    const processedAnswers = answers.map((ans: any) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === ans.questionId
      );

      if (!question) {
        throw new ErrorHandler(
          errorMessages[language].INVALID("Quiz/Test questionId"),
          400
        );
      }

      const isCorrect =
        question.options.find(
          (opt) => opt._id.toString() === ans.selectedOptionId
        )?.text === question.answer;

      isCorrect ? correctCount++ : incorrectCount++;

      return {
        questionId: ans.questionId,
        selectedOptionId: ans.selectedOptionId,
        isCorrect,
      };
    });

    const points = correctCount * 10;

    // ✅ Upsert with status
    const userResponse = await UserResponseModel.findOneAndUpdate(
      { userId, quizId },
      {
        userId,
        quizId,
        type: quiz.type,
        answers: processedAnswers,
        timeTaken,
        points,
        correctCount,
        incorrectCount,
        status: status ?? "completed", // fallback safety
      },
      { new: true, upsert: true, runValidators: true }
    );

    // 🎯 Only assign prizes if quiz is completed
    if (userResponse.status === "completed" && quiz.type === "quiz") {
      await checkAndAssignQuizPrizes(userId.toString());
    }

    return SUCCESS(
      res,
      200,
      successMessages[language].USER_RESPONSE_SUBMITTED,
      { userResponse }
    );
  } catch (error) {
    next(error);
  }
};




export default {
  submitUserResponse
}