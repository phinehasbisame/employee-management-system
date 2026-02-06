import { Router } from "express";
// create a router instance for auth
const userRoute = Router();
// @route POST /api/users - Create system user
userRoute.post("/");
// @route GET /api/users - List all users
userRoute.get("/");
// @route GET /api/users/:id -  Get user details
userRoute.get("/:id");
// @route PATCH /api/users/:id -  Update user
userRoute.patch("/:id");
// @route DELETE /api/users/:id -  Delete user
userRoute.delete("/:id");
export default userRoute;
