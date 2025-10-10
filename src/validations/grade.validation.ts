import Joi from "joi";

 const typeSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Type name must be a string",
    "string.empty": "Type name cannot be empty",
    "any.required": "Type name is required",
  }),
  icon: Joi.string().trim().required().messages({
    "string.base": "Type icon must be a string",
    "string.empty": "Type icon cannot be empty",
    "any.required": "Type icon is required",
  }),
});

// Schema for each subject inside a grade
const subjectSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Subject name must be a string",
    "string.empty": "Subject name cannot be empty",
    "any.required": "Subject name is required",
  }),
  icon: Joi.string().trim().required().messages({
    "string.base": "Subject icon must be a string",
    "string.empty": "Subject icon cannot be empty",
    "any.required": "Subject icon is required",
  }),
  types: Joi.array().items(typeSchema).default([]).messages({
    "array.base": "Types must be an array of objects",
  }),
});

// Main schema for adding a grade
export const addGradeSchema = {
  body: Joi.object({
    grade: Joi.string().trim().required().messages({
      "string.base": "Grade must be a string",
      "string.empty": "Grade cannot be empty",
      "any.required": "Grade is required",
    }),
    icon: Joi.string().trim().required().messages({
      "string.base": "Grade icon must be a string",
      "string.empty": "Grade icon cannot be empty",
      "any.required": "Grade icon is required",
    }),
    subjects: Joi.array().items(subjectSchema).default([]).messages({
      "array.base": "Subjects must be an array of objects",
    }),
  }),
};


export const getByIdValidation = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid ID format",
      "string.length": "Invalid ID length",
      "any.required": "ID is required",
    }),
  }),
};
