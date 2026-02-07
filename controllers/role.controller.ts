import { NextFunction, Request, Response } from "express";
import { throwError } from "../utils/error.js";
import Role from "../models/role.model.js";

// create roles
const createRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const rolePayload = request.body;

  // create a new role
  try {
    const role = await Role.create(rolePayload);

    if (!role) {
      return throwError("Failed creating role", 400, next);
    }

    return response.status(201).json({
      success: true,
      code: 201,
      data: role.toObject({ getters: true }),
      message: "Role created successfully",
    });
  } catch (error) {
    return throwError("Failed to create role", 403, next);
  }
};

// get roles
const getRoles = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const roles = await Role.find().select("-__v");

    if (!roles) {
      return throwError("Failed getting roles", 400, next);
    }

    return response.status(200).json({
      success: true,
      code: 200,
      data: roles,
      message: "Roles fetched successfully",
    });
  } catch (error) {
    return throwError("Error occurred getting roles", 403, next);
  }
};

export { createRole, getRoles };
