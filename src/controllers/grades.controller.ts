import { NextFunction, Request, Response } from "express";
import GradeModel from "../models/grade.model";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { SUCCESS } from "../utils/helpers";
import { successMessages } from "../translations/successMessages.translations";

export const addGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { grade, subjects } = req.body;
    const language = req.language || "en";
    const existing = await GradeModel.findOne({ grade });
    console.log("erorrrrr.....",errorMessages[language].ALREADY_EXISTS("Grade"))
    if (existing) {
      return next(
        new ErrorHandler(errorMessages[language].ALREADY_EXISTS("Grade"), 409)
      )
    }
    const newGrade = await GradeModel.create({ grade, subjects: subjects });
    SUCCESS(res, 201, successMessages[language].GRADE_CREATED, { newGrade })
  } catch (error) {
    next(error);
  }
};


export const getAllGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grades = await GradeModel.find({}, { grade: 1 }).lean();
    const language = req.language || "en"
    SUCCESS(res, 200, successMessages[language].GRADES_FETCHED, { grades })
    // res.status(200).json(grades);
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
    SUCCESS(res, 200, successMessages[language].GRADE_FETCHED, { grade })
    // res.status(200).json(grade);
  } catch (error) {
    next(error);
  }
}


export default {
  addGrade,
  getAllGrades,
  getGradeById
}