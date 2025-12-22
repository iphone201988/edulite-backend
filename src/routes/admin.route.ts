import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import adminController from "../controllers/admin.controller";
const adminRouter = express.Router();

adminRouter.get("/dashboard",authMiddleware,adminController.getDashboardStats);
adminRouter.get("/users/stats", adminController.getUserStats);
adminRouter.get("/users", adminController.getAllUsers);
adminRouter.get("/users/:id", adminController.getUserById);
adminRouter.put("/users/:id", adminController.updateUserByAdmin);
adminRouter.patch("/users/:id/status", adminController.changeUserStatus);
adminRouter.delete("/users/:id", adminController.deleteUser);

export default adminRouter;
