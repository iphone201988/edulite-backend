import Joi from "joi";

const subjectSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Subject name must be a string",
    "any.required": "Subject name is required",
  }),
  types: Joi.array()
    .items(Joi.string())
    .default([])
    .messages({
      "array.base": "Types must be an array of strings",
    }),
});

// Grade schema
export const addGradeSchema = {body:Joi.object({
  grade: Joi.string().required().messages({
    "string.base": "Grade must be a string",
    "any.required": "Grade is required",
  }),
  subjects: Joi.array().items(subjectSchema).default([]),
})};

export const getByIdValidation = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid ID format",
      "string.length": "Invalid ID length",
      "any.required": "ID is required",
    }),
  }),
};
