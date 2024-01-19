import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { genAcctNumber } from "../utils/genAcctNumber.js";
import { apiVersion } from "../app.js";
import { handleError } from "../utils/handleError.js";

// SIGN UP FORM
const signUpForm = (req, res) => {
  res.status(200).render("signUpForm", { apiVersion });
};

// LOGIN FORM
const loginForm = (req, res) => {
  res.status(200).render("loginForm", { apiVersion });
};

// SIGN_UP USER
const signUpUser = async (req, res) => {
  try {
    const { firstname, lastname, email, address, tel, password } = req.body;
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw new Error("user with this wemail already exist");
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
  } catch (err) {
    console.log(err);
    res.status(400).render("error", { apiVersion });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
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
              throw new Error(err.message);
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
          }
        );
      } else {
        throw new Error("password is incorrect");
      }
    } else {
      throw new Error("user with this email does not exist");
    }
  } catch (err) {
    console.log(err);
    const error = handleError(err);
    res.status(400).json({
      success: false,
      error,
    });
  }
};

const userHome = (req, res) => {
  res.status(200).render("home", { apiVersion });
};

const logoutUser = (req, res) => {
  res.cookie("userToken", "", { expiresIn: 0 });
  res.redirect(`${apiVersion}/login`);
};

export { signUpForm, loginForm, signUpUser, loginUser, userHome, logoutUser };
