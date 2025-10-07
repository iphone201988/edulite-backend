import { NextFunction, Request, Response } from "express";
import GradeModel from "../models/grade.model";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";

export const addGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { grade,subjects } = req.body;

    const existing = await GradeModel.findOne({ grade });
    if (existing) {
      return res.status(400).json({ message: "Grade already exists" });
    }
    const newGrade = await GradeModel.create({ grade, subjects:subjects});
    res.status(201).json(newGrade);
  } catch (error) {
    next(error);
  }
};


export const getAllGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grades = await GradeModel.find({}, { grade: 1 }).lean();

    res.status(200).json(grades);
  } catch (error) {
    next(error);
  }
};



export const getGradeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const language = req.language || "en";
    const { id } = req.params;

    const grade = await GradeModel.findById(id);

    if (!grade) {
      return next(new ErrorHandler(errorMessages[language].NOT_FOUND("Grade"), 404));
    }

    res.status(200).json(grade);
  } catch (error) {
    next(error);
  }
}


export default {
    addGrade,
    getAllGrades,
    getGradeById
}