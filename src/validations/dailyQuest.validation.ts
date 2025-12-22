import Joi from "joi";

export const createDailyQuestSchema = {
    body: Joi.object({
        date: Joi.date().required().messages({
            "any.required": "Date is required",
            "date.base": "Date must be a valid date",
        }),

        type: Joi.string()
            .valid("questReading", "questQuiz")
            .required()
            .messages({
                "any.only": "Type must be one of 'reading', 'test', or 'quiz'",
                "any.required": "Type is required",
            }),

        questType: Joi.string()
            .valid("single", "team")
            .required()
            .messages({
                "any.only": "Quest type must be either 'single' or 'team'",
                "any.required": "Quest type is required",
            }),

        name: Joi.string().required().messages({
            "any.required": "Name is required",
        }),

        class: Joi.string().required().messages({
            "any.required": "Class is required",
        }),

        testQuizId: Joi.when("type", {
            is: Joi.valid("questQuiz"),
            then: Joi.string().required().messages({
                "any.required": "testQuizId is required for test or quiz type",
            }),
            otherwise: Joi.forbidden(),
        }),

        readingId: Joi.when("type", {
            is: "questReading",
            then: Joi.string().required().messages({
                "any.required": "readingId is required for reading type",
            }),
            otherwise: Joi.forbidden(),
        }),
    })
};
