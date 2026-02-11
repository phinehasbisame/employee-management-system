import { check } from "express-validator";
import { throwError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/dotenv.js";
import { Register } from "../models/auth.model.js";
// run checks for invalid credentials
const registerChecks = [
    check("fullName").notEmpty(),
    check("email").isEmail().normalizeEmail(),
    check("password").notEmpty(),
    check("role").notEmpty(),
];
// run checks for invalid login credential
const loginChecks = [
    check("email").isEmail().normalizeEmail(),
    check("password").notEmpty(),
];
// protected route access middleware
const protectRoute = async (request, response, next) => {
    // extract token from authorization header
    let token;
    if (request.headers.authorization &&
        request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization?.split(" ")[1]; // make sure to get token from Bearer <token>
    }
    console.log(token);
    if (!token) {
        return throwError("Token not found", 404, next);
    }
    // if there is token, we check whether it's a valid token using jsonwebtoken
    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log(decodedToken);
    const { userId, email } = decodedToken;
    // check if userId exists in the database
    let user;
    try {
        user = await Register.findById(userId);
        if (!user) {
            return throwError("Invalid token", 403, next);
        }
    }
    catch (error) {
        return throwError("User ID does not exist", 400, next);
    }
    // if user is found then
    request.userId = user.id;
    // proceed with request
    next();
};
export { registerChecks, loginChecks, protectRoute };
