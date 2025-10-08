import Joi from "joi";

export const addCreativeProjectSchema = {body:Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must be at most 100 characters",
            "any.required": "Name is required",
        }),
    description: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .required()
        .messages({
            "string.base": "Description must be a string",
            "string.empty": "Description is required",
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description must be at most 500 characters",
            "any.required": "Description is required",
        }),
    grade: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": "Grade must be a string",
            "string.empty": "Grade is required",
            "any.required": "Grade is required",
        }),
    subject: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": "Subject must be a string",
            "string.empty": "Subject is required",
            "any.required": "Subject is required",
        }),
    time: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": "Time must be a string",
            "string.empty": "Time is required",
            "any.required": "Time is required",
        }),
})};