import { Router } from "express";
import prizeController from "../controllers/prize.controller";
import authMiddleware from "../middleware/auth.middleware";
const prizeRouter = Router();

prizeRouter.post("/", prizeController.createPrize);
prizeRouter.get("/", prizeController.getPrizes);
prizeRouter.put("/:id", prizeController.updatePrize);
prizeRouter.delete("/:id", prizeController.deletePrize);

// User Prize routes
prizeRouter.post("/assign", prizeController.assignPrizeToUser);
prizeRouter.get("/user",authMiddleware, prizeController.getUserPrizes);

export default prizeRouter;