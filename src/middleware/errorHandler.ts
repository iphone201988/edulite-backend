import { Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { NextFunction } from "connect";
import { errorMessages, Language } from "../translations/errorHandler";

export const getLanguage = (req: Request): Language => {
  const langHeader = req.headers["accept-language"];
  if (langHeader?.toLowerCase().startsWith("ar")) return "ar";
  return "en";
};

export const errorMiddleware = async (
  error: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lang = getLanguage(req);

  // Default
  error.message = error.message ;
  error.statusCode = error.statusCode || 500;

  // JWT errors
  if (error.message === "jwt expired") {
    error.message = errorMessages[lang].JWT_EXPIRED;
    error.statusCode = 401;
  }
  if (error.message === "invalid signature") {
    error.message = errorMessages[lang].INVALID_SIGNATURE;
    error.statusCode = 400;
  }

  // Mongo duplicate key error
  if ((error as any).code === 11000) {
    const key = Object.keys((error as any).keyPattern)[0];
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
    error.message = errorMessages[lang].ALREADY_EXISTS(formattedKey);
    error.statusCode = 400;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
