import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { changePasswordSchema, forgetPasswordSchema, loginUserSchema, registerSchema, resendOtpSchema, resetPasswordSchema, updateProfileSchema, verifyUserEmailSchema } from "../validations/user.validations";
import { register } from "module";
const userRouter = express.Router();


userRouter.post("/register",validate(registerSchema),userController.register);
userRouter.post("/verify-otp",validate(verifyUserEmailSchema),userController.verifyUserEmail)
userRouter.post("/login",validate(loginUserSchema),userController.loginUser)
userRouter.post("/update-profile",authMiddleware,validate(updateProfileSchema),userController.updateProfile)
userRouter.post("/change-password",authMiddleware,validate(changePasswordSchema),userController.changePassword)
userRouter.post("/forgot-password",validate(forgetPasswordSchema),userController.forgetPassword)
userRouter.post("/reset-password",userController.resetPassword)
userRouter.post("/logout",authMiddleware,userController.accountLogout)
userRouter.post("/delete",authMiddleware,userController.accountDelete)
userRouter.post("/social-login",userController.socialLogin)
userRouter.post("/resend-otp",validate(resendOtpSchema),userController.resendOtp)
// userRouter.get("/get-profile",authMiddleware,userController.getProfile)
export default userRouter;
