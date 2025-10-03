import {IUser} from "./src/types/user.types"

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
