import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  checkAuthenticateUser,
} from "../controllers/auth.controller.js";
import { loginChecks, registerChecks } from "../middleware/auth.middleware.js";

// create a router instance for auth
const authRoute = Router();

// @route POST /api/auth/register - Register admin or HR user
authRoute.post("/register", registerChecks, registerUser);

// @route POST /api/auth/login -  Login user and return token
authRoute.post("/login", loginChecks, loginUser);

// @route GET /api/auth/me – Get current authenticated user
authRoute.get("/me", checkAuthenticateUser);

// @route POST /api/auth/logout - Logout user
authRoute.post("/logout", logoutUser);

// @route PATCH /api/auth/forgot-password - Forgot user password
authRoute.patch("/forgot-password", forgotPassword);


export default authRoute;
