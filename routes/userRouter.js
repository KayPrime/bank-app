import { Router } from "express";
import {
  signUpForm,
  loginForm,
  signUpUser,
  loginUser,
  userHome,
  logoutUser,
  resetPasswordForm,
  resetPasswordRequest,
  updatePasswordForm,
  updatePassword
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/userVerification.js";

const userRouter = Router();

userRouter.get("/sign-up", signUpForm);
userRouter.get("/login", loginForm);
userRouter.post("/sign-up-user", signUpUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/home", verifyUser, userHome);
userRouter.get("/logout", logoutUser);
userRouter.get("/reset-password", resetPasswordForm);
userRouter.post("/reset-password-req", resetPasswordRequest);
userRouter.get("/update-password/:id/:token", updatePasswordForm);
userRouter.put("/update-password-req/:id/:token", updatePassword)

export { userRouter };
