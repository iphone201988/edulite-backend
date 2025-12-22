import Joi, { x } from "joi";
import { deviceType, language, roleType } from "../utils/enums";

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),

    dob: Joi.date()
      .iso()
      .less("now")
      .required()
      .messages({
        "date.base": "Date of birth must be a valid date",
        "date.less": "Date of birth must be in the past",
      }),

    email: Joi.string().email().lowercase().trim().required(),

    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters long",
      }),

    deviceToken: Joi.string().optional(),

    deviceType: Joi.number()
      .valid(...Object.values(deviceType))
      .required()
      .messages({
        "any.only": `Device type must be one of: ${Object.keys(deviceType).join(", ")}`,
      }),

    language: Joi.string()
      .valid(...Object.values(language))
      .default(language.ENGLISH),

    role: Joi.number()
      .valid(...Object.values(roleType))
      .required()
      .messages({
        "any.only": `Role must be one of: ${Object.keys(roleType).join(", ")}`,
      }),
    countryCode: Joi.string()
      .pattern(/^\+\d{1,4}$/) // e.g. +1, +44, +91
      .required()
      .messages({
        "string.pattern.base": "countryCode must be in format like +1, +44, +91",
        "any.required": "countryCode is required",
      }),
    phone: Joi.string()
      .required()
      .messages({
        "string.pattern.base": "phone must be in E.164 format (e.g. +14155552671)",
        "any.required": "phone is required",
      }),
  })
};




export const verifyUserEmailSchema = {
  body: Joi.object({
    otp: Joi.string().length(4).required(),
    email: Joi.string().email().lowercase().trim().required(),
    type: Joi.number()
      .valid(1, 2) // 1 = email verification, 2 = forgot password
      .required()
      .messages({
        "any.only": "Type must be 1 (email verification) or 2 (forgot password)",
      }),

    language: Joi.string()
      .valid(...Object.values(language))
      .default(language.ENGLISH),
  })
};






export const loginUserSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        "string.email": "A valid email is required",
        "any.required": "Email is required",
      }),

    password: Joi.string()
      .min(6) // usually at least 6 chars
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),

    deviceType: Joi.number()
      .valid(...Object.values(deviceType)) // 1, 2, 3
      .required()
      .messages({
        "any.only": "Device type must be 1 (iOS), 2 (Android), or 3 (Web)",
        "any.required": "Device type is required",
      }),

    deviceToken: Joi.string()
      .required()
      .messages({
        "any.required": "Device token is required",
      }),

    language: Joi.string()
      .valid(...Object.values(language)) // "ar", "en", "fr"
      .default(language.ENGLISH),
  })
};



export const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),

    dob: Joi.date()
      .iso()
      .less("now")
      .optional()
      .messages({
        "date.base": "Date of birth must be a valid date",
        "date.less": "Date of birth must be in the past",
      }),

    bio: Joi.string().max(500).optional(),

    preferredLanguage: Joi.string()
      .valid(...Object.values(language)) // "en", "ar", "fr"
      .optional(),

    address: Joi.string().max(255).optional(),

    profilePicture: Joi.string().uri().optional().messages({
      "string.uri": "Profile picture must be a valid URL",
    }),

    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).optional(),
  })
};




export const changePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.base": "Old password must be a string",
        "string.min": "Old password must be at least 6 characters long",
        "any.required": "Old password is required",
      }),

    newPassword: Joi.string()
      .min(6)
      .disallow(Joi.ref("oldPassword")) // prevent same as oldPassword
      .required()
      .messages({
        "string.base": "New password must be a string",
        "string.min": "New password must be at least 6 characters long",
        "any.required": "New password is required",
        "any.invalid": "New password cannot be the same as old password",
      }),
  })
};




export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),

    language: Joi.string()
      .valid(...Object.values(language))
      .optional()
      .messages({
        "any.only": `Language must be one of ${Object.values(language).join(", ")}`,
      }),
  })
};


export const resetPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),

    newPassword: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.base": "New password must be a string",
        "string.min": "New password must be at least 6 characters long",
        "any.required": "New password is required",
      }),
    language: Joi.string()
      .valid(...Object.values(language))
      .optional()
      .messages({
        "any.only": `Language must be one of ${Object.values(language).join(", ")}`,
      }),
  })
};




export const resendOtpSchema = {body:Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  type: Joi.number()
    .valid(1, 2)
    .required()
    .messages({
      "number.base": "Type must be a number (1 or 2)",
      "any.only": "Type must be 1 (verify) or 2 (reset)",
      "any.required": "Type is required",
    }),

  language: Joi.string()
    .valid("en", "fr", "ar")
    .default("en")
    .messages({
      "string.base": "Language must be a string",
      "any.only": "Language must be one of: en, fr, ar",
    }),
})};