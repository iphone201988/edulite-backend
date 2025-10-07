import express from "express"
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import userResponseController from "../controllers/userResponse.controller";
import { submitUserResponseSchema } from "../validations/userResponse.validation";
const userResponseRouter = express.Router();

userResponseRouter.post("/",authMiddleware,validate(submitUserResponseSchema),userResponseController.submitUserResponse)
// userResponseRouter.get("/",authMiddleware,)
// userResponseRouter.get("/:id",authMiddleware,)


export default userResponseRouter;

