import express from "express"
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import creativeProjectController from "../controllers/creativeProject.controller";
import { addCreativeProjectSchema } from "../validations/creativeProject.validation";
const creativeProjectRouter = express.Router();

creativeProjectRouter.post("/",authMiddleware,validate(addCreativeProjectSchema),creativeProjectController.addCreativeProject)
// userResponseRouter.get("/",authMiddleware,)
// userResponseRouter.get("/:id",authMiddleware,)


export default creativeProjectRouter;

