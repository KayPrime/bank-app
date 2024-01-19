import { Router } from "express";
import { signUpForm, loginForm, signUpUser, loginUser, userHome, logoutUser } from "../controllers/userController.js";
import { verifyUser } from "../middlewares/userVerification.js"


const userRouter = Router();

userRouter.get("/sign-up", signUpForm);
userRouter.get("/login", loginForm);
userRouter.post("/sign-up-user", signUpUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/home",verifyUser, userHome);
userRouter.get("/logout", logoutUser)

export { userRouter };