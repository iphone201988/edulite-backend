import Joi from "joi";
import mongoose from "mongoose";



export const createVideoSchema = {
    body: Joi.object({
        title: Joi.string().trim().min(2).max(200).required(),

        grade: Joi.string().trim().required(),

        subject: Joi.string().trim().min(2).max(100).required(),

        time: Joi.number().positive().required(), // seconds

        videoUrl: Joi.string().required(),

        thumbnailUrl: Joi.string().optional().allow(""),
    })
};



const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "ObjectId Validation");



export const updateVideoSchema = {
    body: Joi.object({
        title: Joi.string().trim().min(2).max(200),

        grade: Joi.string().trim().min(1).max(100),

        subject: Joi.string().trim().min(1).max(100),

        time: Joi.number().positive(),

        videoUrl: Joi.string(),

        thumbnailUrl: Joi.string().allow(""),

        isDeleted: Joi.boolean(),
    }).min(1)
}; 
