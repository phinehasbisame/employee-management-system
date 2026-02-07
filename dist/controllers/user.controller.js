import { throwError } from "../utils/error.js";
import User from "../models/user.model.js";
// create user
const createUser = async (request, response, next) => {
    // create a user
    const { fullName, email, department, jobTitle, isActive } = request.body;
    try {
        // check if email already exists
        const withEmail = await User.findOne({ email });
        if (withEmail) {
            return throwError("Email already exists", 403, next);
        }
        // if no email of such exists, then we create a new user
        const user = await User.create({
            fullName,
            email,
            department,
            jobTitle,
            isActive,
        });
        if (!user) {
            return throwError("Failed while creating user", 403, next);
        }
        return response.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    }
    catch (error) {
        return throwError("Failed to create user", 403, next);
    }
};
// get all users
const getAllUser = async (request, response, next) => {
    // get all query params
    let queryParams = request.query;
    const excludeQuery = ["page", "pageSize", "sort"];
    // automatically remove this from the query if they exists cus it isn't found in the database and can't be filter
    excludeQuery.forEach((query) => delete queryParams[query]);
    try {
        // implementing pagination
        const page = request.query.page * 1 || 1;
        const pageSize = request.query.pageSize * 1 || 5;
        const skip = (page - 1) * pageSize;
        // get all users following pagination
        const users = await User.find(queryParams).skip(skip).limit(pageSize);
        if (!users) {
            return throwError("No user found", 403, next);
        }
        return response.status(200).json({
            success: true,
            message: "Fetched users successfully",
            results: users.length,
            page,
            pageSize,
            data: users,
        });
    }
    catch (error) {
        return throwError("Failed to get all users", 500, next);
    }
};
// get user by id
const getUserById = async (request, response, next) => {
    // get user id from request params
    const { id } = request.params;
    try {
        // get user from database by using ID
        const user = await User.findById(id).select("-__v");
        if (!user) {
            return throwError("No user ID found", 400, next);
        }
        return response.status(200).json({
            success: true,
            code: 200,
            user: user.toObject({ getters: true }),
            message: "User fetched successfully",
        });
    }
    catch (error) {
        return throwError("Error occurred getting user by ID", 400, next);
    }
};
// filter user by any criteria
const filterUser = async (request, response, next) => {
    // get query parameter from request
    const query = request.query;
    console.log(query);
    // remove page, pageSize and sort from query obj
    const queryObj = { ...query };
    const excludeQuery = ["page", "limit", "sort"];
    excludeQuery.forEach((value) => delete queryObj[value]);
    // get user for a filter
    try {
        // find user by filter
        // Pagination
        const page = Number(query?.page) * 1 || 1;
        const limit = Number(query.limit) || 2;
        const skip = (page - 1) * limit;
        console.log(page, limit, skip);
        const filterUser = await User.find(queryObj).skip(skip).limit(limit);
        console.log(filterUser);
        console.log(filterUser);
        if (!filterUser) {
            return throwError("Failed filtering users", 400, next);
        }
        // if filter for user is available we return it
        return response.status(200).json({
            success: true,
            message: "User filtered successfully",
            data: filterUser,
        });
    }
    catch (error) {
        return throwError("Failed to filter users", 403, next);
    }
};
// update user
const updateUser = async (request, response, next) => {
    // get user id from params
    const { id } = request.params;
    // get update details from body
    const updateDetails = request.body;
    try {
        const updateUser = await User.findByIdAndUpdate(id, updateDetails).select("-__v");
        if (!updateUser) {
            return throwError("Error occurred updating user", 403, next);
        }
        return response.status(200).json({
            success: true,
            code: 200,
            user: updateUser.toObject({ getters: true }),
            message: "Updated user successfully",
        });
    }
    catch (error) {
        return throwError("Failed updating user", 400, next);
    }
};
// delete user
const deleteUser = async (request, response, next) => {
    const { id } = request.params;
    try {
        // find user ID and delete
        const deleteUser = await User.findByIdAndDelete(id);
        console.log(deleteUser);
        if (!deleteUser) {
            return throwError("User ID not found", 404, next);
        }
        return response.status(200).json({
            status: 200,
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        return throwError("Error occurred deleting user", 400, next);
    }
};
export { createUser, getAllUser, getUserById, updateUser, deleteUser, filterUser, };
