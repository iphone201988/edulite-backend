import Joi from "joi";

export const submitUserResponseSchema = {body:Joi.object({
  quizId: Joi.string().length(24).required().messages({
    "string.base": "quizId must be a string",
    "string.length": "quizId must be a valid ObjectId",
    "any.required": "quizId is required",
  }),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().length(24).required().messages({
          "string.base": "questionId must be a string",
          "string.length": "questionId must be a valid ObjectId",
          "any.required": "questionId is required",
        }),
        selectedOptionId: Joi.string().length(24).required().messages({
          "string.base": "selectedOptionId must be a string",
          "string.length": "selectedOptionId must be a valid ObjectId",
          "any.required": "selectedOptionId is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "answers must be an array",
      "array.min": "answers must contain at least one item",
      "any.required": "answers are required",
    }),
  timeTaken: Joi.number().min(0).required().messages({
    "number.base": "timeTaken must be a number",
    "number.min": "timeTaken cannot be negative",
    "any.required": "timeTaken is required",
  }),
})};