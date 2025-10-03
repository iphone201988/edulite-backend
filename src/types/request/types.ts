import { ObjectId, Types } from "mongoose";
import { IUser } from "../user.types";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
    userId?: Types.ObjectId | string;
    language?:string
  }
}


export {};
