// validate.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Language } from "../translations/errorHandler";
import { deviceType, roleType } from "../utils/enums";
import { validationMessages } from "../translations/user.validation.translation";

const removeEmptyValues = (obj: any) => { /* your same function */ };
const translateKey = (key: string, lang: Language) => {
  const parts = key.split(".");
  const fieldName = parts.shift(); // first part
  const path = parts; // remaining path parts

  let node: any = validationMessages[lang]?.[fieldName!];
  for (const p of path) {
    if (typeof node === "function") {
      // handle dynamic function e.g. only(valids)
      break;
    }
    node = node?.[p];
  }

  // if node is a function (like "only"), call it with needed params
  if (typeof node === "function") {
    if (fieldName === "deviceType") {
      return node(deviceType.WEB, deviceType.ANDROID, deviceType.IOS);
    }
    if (fieldName === "role") {
      return node(roleType.ADMIN, roleType.STUDENT, roleType.TEACHER);
    }
    // add other dynamic cases here if needed
  }

  return node ?? key; // fallback to key itself
};
const validate = (schema: any): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      Object.assign(req.body, removeEmptyValues(req.body));
      Object.assign(req.query, removeEmptyValues(req.query));
      Object.assign(req.params, removeEmptyValues(req.params));

      // pick language from body/query/header, default 'en'
      const lang: Language =
        (req.body.language || req.language || req.query.language || req.headers["accept-language"]) === "it"
          ? "ar"
          : "en";
          console.log(lang)

      const validationErrors: string[] = [];

      const validateField = (
        field: "params" | "query" | "body",
        data: any
      ) => {
        if (schema[field]) {
          const result = schema[field].validate(data, { abortEarly: false });
          console.log(result)
          if (result.error) {
            validationErrors.push(
              ...result.error.details.map((error: any) =>
                translateKey(error.message, lang) || error.message
              )
            );
            
          }
        }
      };



      validateField("params", req.params);
      validateField("query", req.query);
      validateField("body", req.body);
      

      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: validationErrors[0],
          details: validationErrors,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
