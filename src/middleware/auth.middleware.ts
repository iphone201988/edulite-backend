import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { verifyToken } from "../utils/helpers";
import User from "../models/user.model";
import { Types } from "mongoose";
import { AccountStatus } from "../utils/enums";
import { errorMessages } from "../translations/errorHandler";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({
            message:"UNAUTHORISED",
            success:false
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);

    if (!decoded || !decoded.id) {
     return res
        .status(401)
        .json({
            message:"UNAUTHORISED",
            success:false
        });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({
            message:"UNAUTHORISED",
            success:false
        });
    }
    const language=user.preferredLanguage || "en"
     if (user.status === AccountStatus.SUSPENDED) {
      return res.status(403).json({
        success: false,
        message: errorMessages[language].ACCOUNT_SUSPENDED || "Your account is suspended",
      });
    }

    req.language = user.preferredLanguage || "en";
    req.user = user;
    req.userId = user._id as Types.ObjectId;

    next();
  } catch (error: any) {
    // Catch unexpected errors
    return res
      .status(error.statusCode || 401)
      .json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export default authMiddleware;
