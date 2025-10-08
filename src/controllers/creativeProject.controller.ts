import { NextFunction, Request, Response } from "express";
import creativeProjectProjectModel from "../models/creativeProject.model";
import ErrorHandler from "../utils/errorHandler";
import { errorMessages } from "../translations/errorHandler";
import { language } from "../utils/enums";
import { SUCCESS } from "../utils/helpers";
import { successMessages } from "../translations/successMessages.translations";




export const addCreativeProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { name, description, grade, subject, time } = req.body
        const language=req.language||"en"
        const existing = await creativeProjectProjectModel.findOne({ name, description, grade, subject, });
        if (existing) {
            return next(new ErrorHandler(errorMessages[language].ALREADY_EXISTS("Creative Project"), 409))
        }
        const newCreativeProject = await creativeProjectProjectModel.create({ name, description, grade, subject, time })
        SUCCESS(res, 201, successMessages[language].CREATIVE_PROJECT_CREATED, { newCreativeProject })
        // res.status(201).json(newCreativeProject)
    } catch (error) {
        next(error)
    }
}



export const getFilteredQuizTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { grade, subject, type } = req.query;
    const language=req.language||"en"       
    const filter: any = {};
    if (grade) filter.grade = grade;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;

    const creativeProjects = await creativeProjectProjectModel.find(filter).sort({ createdAt: -1 });
    SUCCESS(res,200,successMessages[language].CREATIVE_PROJECTS_FETCHED,{creativeProjects})
  } catch (error) {
    next(error);
  }
};

export default {
    addCreativeProject,
    getFilteredQuizTests
}