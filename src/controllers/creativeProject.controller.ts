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
    const user = req.user
    const language = req.language || "en"
    const existing = await creativeProjectProjectModel.findOne({ name, description, grade, subject, });
    if (existing) {
      return next(new ErrorHandler(errorMessages[language].ALREADY_EXISTS("Creative Project"), 409))
    }
    const newCreativeProject = await creativeProjectProjectModel.create({ name, description, grade, subject, time, userName: user.name, userId: user._id })
    SUCCESS(res, 200, successMessages[language].CREATIVE_PROJECT_CREATED, { newCreativeProject })
    // res.status(200).json(newCreativeProject)
  } catch (error) {
    next(error)
  }
}



export const getFilteredProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { grade, subject, type } = req.query;
    const language = req.language || "en"
    const filter: any = {};
    if (grade) filter.grade = grade;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;

    const creativeProjects = await creativeProjectProjectModel.find(filter).sort({ createdAt: -1 });
    SUCCESS(res, 200, successMessages[language].CREATIVE_PROJECTS_FETCHED, { creativeProjects })
  } catch (error) {
    next(error);
  }
};



export const getCreativeProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const language = (req as any).language || "en";

    const project = await creativeProjectProjectModel.findById(id);

    if (!project) {
      return next(new ErrorHandler(errorMessages[language].NOT_FOUND("Creative Project"), 404));
    }

    SUCCESS(res, 200, successMessages[language].CREATIVE_PROJECT_FETCHED, { project });
  } catch (error) {
    next(error);
  }
};


export const updateCreativeProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, description, grade, subject, time } = req.body;
    const language = req.language || "en";

    const project = await creativeProjectProjectModel.findById(id);

    if (!project) {
      return next(new ErrorHandler(errorMessages[language].NOT_FOUND("Creative Project"), 404));
    }

    // Check if another project with same details exists (excluding current project)
    if (name || description || grade || subject) {
      const existing = await creativeProjectProjectModel.findOne({
        _id: { $ne: id },
        name: name || project.name,
        description: description || project.description,
        grade: grade || project.grade,
        subject: subject || project.subject,
      });

      if (existing) {
        return next(new ErrorHandler(errorMessages[language].ALREADY_EXISTS("Creative Project"), 409));
      }
    }

    const updatedProject = await creativeProjectProjectModel.findByIdAndUpdate(
      id,
      {
        name: name || project.name,
        description: description || project.description,
        grade: grade || project.grade,
        subject: subject || project.subject,
        time: time || project.time,
      },
      { new: true, runValidators: true }
    );

    SUCCESS(res, 200, successMessages[language].CREATIVE_PROJECT_UPDATED, { project: updatedProject });
  } catch (error) {
    next(error);
  }
};

export const deleteCreativeProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const language = req.language || "en";

    const project = await creativeProjectProjectModel.findById(id);

    if (!project) {
      return next(new ErrorHandler(errorMessages[language].NOT_FOUND("Creative Project"), 404));
    }

    await creativeProjectProjectModel.findByIdAndDelete(id);

    SUCCESS(res, 200, successMessages[language].CREATIVE_PROJECT_DELETED, {
      deletedProject: { id: project._id, name: project.name }
    });
  } catch (error) {
    next(error);
  }
};



export default {
  addCreativeProject,
  getFilteredProjects,
  getCreativeProjectById,
  updateCreativeProject,
  deleteCreativeProject
}