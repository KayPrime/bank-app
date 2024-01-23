import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { genAcctNumber } from "../utils/genAcctNumber.js";
import { apiVersion } from "../app.js";
import { catchErrorFunc } from "../utils/catchErrorFunc.js";
import { UserError } from "../utils/error.js";
import { sendMail } from "../utils/sendMail.js";

// SIGN UP FORM
const signUpForm = catchErrorFunc(async (req, res) => {
  res.status(200).render("signUpForm", { apiVersion });
});

// LOGIN FORM
const loginForm = catchErrorFunc(async (req, res) => {
  res.status(200).render("loginForm", { apiVersion });
});

// SIGN_UP USER
const signUpUser = catchErrorFunc(async (req, res) => {
  const { firstname, lastname, email, address, tel, password } = req.body;
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    throw new UserError(
      process.env.EXISTING_EMAIL_ERROR_CODE,
      "user with this email already exist",
      400
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    firstname,
    lastname,
    email,
    password: hashPassword,
    accountNumber: genAcctNumber(),
    address,
    tel,
  });

  await newUser.save();
  res.cookie("userToken", "", { expiresIn: 0 });
  res.status(201).redirect(`${apiVersion}/login`);
});

// LOGIN USER
const loginUser = catchErrorFunc(async (req, res) => {
  const period = 60 * 60 * 24;
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (passwordIsCorrect) {
      jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: period },
        async (err, token) => {
          if (err) {
            console.log(err.message);
            throw new UserError(
              process.env.JWT_TOKEN_ERROR_CODE,
              err.message,
              400
            );
          }
          res.cookie("userToken", token, {
            maxAge: 1000 * period,
            httpOnly: true,
          });
          res.status(200).json({
            success: true,
            user,
            msg: "user logged in successfully",
            location: `${apiVersion}/home`,
          });
          const message = `<h1>Hello</h1>
      <p>A login event associated with your account was detected at. If you didn't make this request, kindly contact our support</p>`;
          await sendMail(user.email, "login detected", "Hello user", message);
        }
      );
    } else {
      throw new UserError(
        process.env.INCORRECT_PASSWORD_ERROR_CODE,
        "password is incorrect",
        400
      );
    }
  } else {
    throw new UserError(
      process.env.INVALID_EMAIL_ERROR_CODE,
      "user with this email does not exist",
      400
    );
  }
});

const userHome = catchErrorFunc(async (req, res) => {
  res.status(200).render("home", { apiVersion });
});

const logoutUser = catchErrorFunc(async (req, res) => {
  res.cookie("userToken", "", { expiresIn: 0 });
  res.redirect(`${apiVersion}/login`);
});

const resetPasswordForm = catchErrorFunc(async (req, res) => {
  res.status(200).render("resetPassword", { apiVersion });
});

const resetPasswordRequest = catchErrorFunc(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new UserError(
      process.env.USER_NOT_FOUND_ERROR_CODE,
      "user not found",
      400
    );
  }
  jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: 5 * 60 },
    async (err, token) => {
      if (err) {
        throw new UserError(process.env.JWT_TOKEN_ERROR_CODE, 400);
      }
      const text = `http://localhost:${process.env.PORT}${apiVersion}/update-password/${user._id}/${token}`;
      const message = `<h1>Hello</h1>
      <p>Use the link below to reset your email</p>
      <a href="${text}">Click here to reset</a>`;
      await sendMail(user.email, "Password Reset Link", "Hello user", message);
      res.status(200).render("resetLinkSent", { apiVersion });
    }
  );
});

const updatePasswordForm = catchErrorFunc(async (req, res) => {
  const { id, token } = req.params;
  res.status(200).render("updatePassword", { apiVersion, id, token });
});

const updatePassword = catchErrorFunc(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedToken) => {
    if (err) {
      throw new UserError(process.env.JWT_TOKEN_ERROR_CODE, err.message, 400);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await UserModel.findByIdAndUpdate(id, { password: hashPassword });
    res.status(202).redirect(apiVersion + "/login");
  });
  console.log(id, token, password);
});

export {
  signUpForm,
  loginForm,
  signUpUser,
  loginUser,
  userHome,
  logoutUser,
  resetPasswordForm,
  resetPasswordRequest,
  updatePasswordForm,
  updatePassword,
};
