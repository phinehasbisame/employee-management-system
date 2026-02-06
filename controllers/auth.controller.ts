import { NextFunction, Request, Response } from "express";
import { Login, Register } from "../models/auth.model.js";
import { throwError } from "../utils/error.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/dotenv.js";

const saltRounds: number = 12;

// register controller
const registerUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // get register details from request
  const { fullName, email, password, role } = request.body;

  const validateResult = validationResult(request);
  if (!validateResult.isEmpty()) {
    console.log(validateResult);
    throwError("User body is invalid. Try again", 400, next);
  }

  // logic handling user registration into database
  try {
    // check if email isn't found in the database
    const isEmail = await Register.findOne({ email });
    if (isEmail) {
      throwError("Email already exists. Try again", 400, next);
    }

    // if email isn't found in the database, then we create an account
    // hash password for securing password of users
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) throwError("Error occurred hashing password", 500, next);
      // construct payload
      const registerPayload = {
        fullName,
        email,
        password: hashedPassword,
        role,
      };

      // register user into database with hashedPassword
      const register = await Register.create(registerPayload);
      console.log(register);

      if (register.errors) {
        throwError("Error occurred registering user into database", 400, next);
      } else {
        return response.status(201).json({
          success: true,
          code: 201,
          results: register.toObject({ getters: true }),
        });
      }
    });
  } catch (error) {
    throwError("Failed to register user", 400, next);
  }
};

// login controller
const loginUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // obtain user body for login request
  const { email, password } = request.body;

  // logic for logging in a user
  try {
    // check if email exists in the database
    const userInfo = await Register.findOne({ email });
    console.log(userInfo);
    if (!userInfo) {
      return throwError("Email not found. Create an account", 400, next);
    }

    // if userInfo is available, we get storedHashPassword and compare with the password using bcrypt
    const storedHashPassword = userInfo?.password as string;

    // use bcrypt to compare the password
    bcrypt.compare(password, storedHashPassword, async (err, success) => {
      // if (err) throwError("Error occurred comparing password", 403, next);

      if (success) {
        // sign a token for users
        const token = jwt.sign({ userId: userInfo?.id, email }, JWT_SECRET, {
          expiresIn: "5m",
        });

        return response
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 60 * 1000,
          })
          .json({
            success: true,
            message: "Login successful",
            data: {
              user: userInfo,
              token,
            },
          });
      } else {
        return throwError("Incorrect password", 400, next);
      }
    });
  } catch (error) {
    return throwError("Error occurred logging in user", 400, next);
  }
};

// logout controller
const logoutUser = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {};

// forgot password controller
const forgotPassword = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { email, password } = request.body;

  try {
    // check if email from request is in the database
    const userInfo = await Register.findOne({ email });

    console.log(userInfo);
    console.log(userInfo);
    console.log(userInfo);

    if (!userInfo) {
      return throwError("Email is not found", 400, next);
    }

    // hash new password for security
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) return throwError("Error occurred hashing password", 403, next);

      // if hash success
      const newPayload = {
        fullName: userInfo.fullName as string,
        email: userInfo.email as string,
        role: userInfo.role as string,
        password: hashedPassword,
      };

      // store results in the database
      const updatePassword = await Register.findOneAndUpdate(
        { email },
        { password: hashedPassword },
      );
      console.log(updatePassword);
      if (updatePassword) {
        return response.status(200).json({
          success: true,
          message: "Updated password successfully",
        });
      } else {
        return throwError("Error occurred updating password", 403, next);
      }
    });
  } catch (error) {
    return throwError("Error occurred trying forgot password", 400, next);
  }
};

// check authenticate user controller
const checkAuthenticateUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const token = request.headers.authorization?.split(" ")[1] as string; // extract token from Bearer <token>
  console.log(token);
  if (!token) {
    return throwError("Unauthorized", 401, next);
  }
  const decodeToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (decodeToken && decodeToken?.userId && decodeToken?.email) {
    // verify user from database
    try {
      const hasUserId = await Register.findById(decodeToken.userId);
      if (hasUserId) {
        return response.status(200).json({
          code: 200,
          success: true,
          userId: decodeToken.userId,
          email: decodeToken.email,
          message: "User is authenticated",
        });
      } else {
        return throwError("User ID not found", 500, next);
      }
    } catch (error) {
      return throwError(
        "Error occurred confirming user from database",
        500,
        next,
      );
    }
  } else {
    return throwError("Invalid token passed", 403, next);
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  checkAuthenticateUser,
};
