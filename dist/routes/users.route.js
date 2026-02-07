import { Router } from "express";
import { createUser, getAllUser, getUserById, updateUser, deleteUser, } from "../controllers/user.controller.js";
// create a router instance for auth
const userRoute = Router();
// @route POST /api/users - Create system user
userRoute.post("/", createUser);
// @route GET /api/users - List all users
userRoute.get("/", getAllUser);
// @route GET /api/users/:id -  Get user details
userRoute.get("/:id", getUserById);
// @route PATCH /api/users/:id -  Update user
userRoute.patch("/:id", updateUser);
// @route DELETE /api/users/:id -  Delete user
userRoute.delete("/:id", deleteUser);
export default userRoute;
