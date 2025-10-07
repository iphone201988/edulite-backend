import { Request, Response, NextFunction } from "express";
import QuizTestModel from "../models/testQuiz.model";
import UserResponseModel from "../models/userAnswer.model";

export const submitUserResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const userId = req.userId;

    const quiz: any = await QuizTestModel.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz/Test not found" });

    let correctCount = 0;
    let incorrectCount = 0;

    const processedAnswers = answers.map((ans: any) => {
      const question = quiz.questions.find(q => q._id.toString() === ans.questionId);
      if (!question) throw new Error("Invalid questionId provided");

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

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};



export default {
  submitUserResponse
}