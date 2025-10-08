import express from "express"
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import creativeProjectController from "../controllers/creativeProject.controller";
import { addCreativeProjectSchema } from "../validations/creativeProject.validation";
const creativeProjectRouter = express.Router();

creativeProjectRouter.post("/",authMiddleware,validate(addCreativeProjectSchema),creativeProjectController.addCreativeProject)
creativeProjectRouter.get("/",authMiddleware,creativeProjectController.getFilteredProjects)
creativeProjectRouter.get("/:id",authMiddleware,creativeProjectController.getCreativeProjectById)


export default creativeProjectRouter;

