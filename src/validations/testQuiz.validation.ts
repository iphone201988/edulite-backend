import Joi from "joi";

// Joi validation schema
export const quizTestValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow("").optional(),
    grade: Joi.string().required(),
    subject: Joi.string().required(),
    type: Joi.string().valid("quiz", "test").required(),
    time: Joi.number().min(1).required(), // minutes
    numberOfQuestions: Joi.number().min(1).required(),

    questions: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().min(3).required(),
          options: Joi.array()
            .items(
              Joi.object({
                text: Joi.string().min(1).required(),
              })
            )
            .min(2)
            .required(),
          answer: Joi.string().required(), // should match one of the option.text
        })
      )
      .required(),
  }).custom((value, helpers) => {
    // Extra rule: numberOfQuestions must match length of questions array
    if (value.questions.length !== value.numberOfQuestions) {
      return helpers.error("any.invalid", {
        message: "numberOfQuestions does not match questions array length",
      });
    }

    // Extra rule: each answer must match one of the options
    for (const q of value.questions) {
      if (!q.options.some((opt: any) => opt.text === q.answer)) {
        return helpers.error("any.invalid", {
          message: `Answer "${q.answer}" does not match any option in question "${q.question}"`,
        });
      }
    }

    return value;
  }, "questions validation"),
};



export const getQuizTestByIdValidation = {
  params: Joi.object({
    id: Joi.string()
      .length(24)
      .hex()
      .required()
      .messages({
        "string.length": "Invalid quiz/test ID",
        "string.hex": "Invalid quiz/test ID",
        "any.required": "Quiz/Test ID is required",
      }),
  }),
};







const subjectSchema = Joi.object({
  icon: Joi.string().required().messages({
    "string.base": "icon must be a string",
    "any.required": "icon is required",
  }),
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
export const addGradeSchema = {
  body: Joi.object({
    icon: Joi.string().required().messages({
      "string.base": "icon must be a string",
      "any.required": "icon is required",
    }),
    grade: Joi.string().required().messages({
      "string.base": "Grade must be a string",
      "any.required": "Grade is required",
    }),
    subjects: Joi.array().items(subjectSchema).default([]),
  })
};