import { NextFunction, Request, Response } from "express";
import creativeProjectProjectModel from "../models/creativeProject.model";




export const addCreativeProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { name, description, grade, subject, time } = req.body
        const existing = await creativeProjectProjectModel.findOne({ name, description, grade, subject, });
        if (existing) {
            return res.status(400).json({ message: "Grade already exists" });
        }
        const newCreativeProject = await creativeProjectProjectModel.create({ name, description, grade, subject, time })
        res.status(201).json(newCreativeProject)
    } catch (error) {
        next(error)
    }
}