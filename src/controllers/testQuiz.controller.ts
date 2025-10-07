import { Request, Response, NextFunction } from "express";
import QuizTestModel, { QuizTestDocument } from "../models/testQuiz.model";
import { create } from "node:domain";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { language } from "../utils/enums";

// ✅ Create Quiz/Test
export const createQuizTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, grade, subject, type, time, numberOfQuestions, questions } = req.body as QuizTestDocument;
    const language=req.language||"en"
    // Ensure numberOfQuestions matches questions length
    if (questions.length !== numberOfQuestions) {
      return next(new ErrorHandler(errorMessages[language].NUMBEROFQUESTIONSNOTMACTHED,400))
    }

    const quizTest = new QuizTestModel({ name, description, grade, subject, type, time, numberOfQuestions, questions });
    await quizTest.save();

    res.status(201).json(quizTest);
  } catch (error) {
    next(error);
  }
};

// ✅ Get all Quiz/Tests
export const getFilteredQuizTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { grade, subject, type } = req.query;

    // Build dynamic filter object
    const filter: any = {};
    if (grade) filter.grade = grade;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;

    const quizzes = await QuizTestModel.find(filter).sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

// ✅ Get single Quiz/Test by ID
export const getQuizTestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quiz = await QuizTestModel.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz/Test not found" });
    }
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};







export const updateQuizTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.questions && updateData.numberOfQuestions && updateData.questions.length !== updateData.numberOfQuestions) {
      return res.status(400).json({
        message: "numberOfQuestions does not match the length of questions array",
      });
    }

    const updatedQuiz = await QuizTestModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz/Test not found" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    next(error);
  }
};


export const deleteQuizTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await QuizTestModel.findByIdAndDelete(id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz/Test not found" });
    }

    res.json({ message: "Quiz/Test deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export default {
  createQuizTest,
  getQuizTestById,
  getFilteredQuizTests
}