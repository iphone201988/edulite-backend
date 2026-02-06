import Joi from "joi";
import mongoose from "mongoose";

export const updateReadingProgressSchema = {
    body: Joi.object({
        readingId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .messages({
                "string.empty": "Reading ID is required",
                "any.required": "Reading ID is required",
                "any.invalid": "Invalid Reading ID",
            }),

        status: Joi.string()
            .valid("pending", "in-progress", "completed")
            .required()
            .messages({
                "string.empty": "Status is required",
                "any.only": "Status must be one of not_started, in_progress, completed",
                "any.required": "Status is required",
            }),
    })
};
