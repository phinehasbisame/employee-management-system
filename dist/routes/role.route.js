import { Router } from "express";
import { createRole, getRoles } from "../controllers/role.controller.js";
// create role router instance
const roleRoute = Router();
/** ROLES */
// @route POST /api/roles
roleRoute.post("/", createRole);
// @route GET /api/roles
roleRoute.get("/", getRoles);
export default roleRoute;
