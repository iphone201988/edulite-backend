import Joi from "joi";
import mongoose from "mongoose";



export const createVideoSchema = {
    body: Joi.object({
        title: Joi.string().trim().min(2).max(200).required(),

        grade: Joi.string().trim().required(),

        subject: Joi.string().trim().min(2).max(100).required(),

        time: Joi.number().positive().required(), // seconds

        videoUrl: Joi.string().uri().required(),

        thumbnailUrl: Joi.string().uri().optional().allow(""),
    })
};



const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "ObjectId Validation");

/**
 * ✅ Update Video Validation
 */
export const updateVideoSchema = {
    body: Joi.object({
        title: Joi.string().trim().min(2).max(200),

        grade: Joi.string().trim().min(1).max(100),

        subject: Joi.string().trim().min(1).max(100),

        time: Joi.number().positive(),

        videoUrl: Joi.string().uri(),

        thumbnailUrl: Joi.string().uri().allow(""),

        isDeleted: Joi.boolean(),
    }).min(1)
}; 
