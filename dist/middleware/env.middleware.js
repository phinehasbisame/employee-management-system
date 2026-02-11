import { JWT_SECRET, MONGODB_URI, PORT } from "../config/dotenv.js";
import HttpError from "../utils/http-error.js";
const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET"];
export const checkForEnv = (request, response, next) => {
    const missingEnv = REQUIRED_ENV_VARS.filter((key) => {
        const value = process.env[key];
        return !value || value.trim() === "";
    });
    if (!PORT || !MONGODB_URI || !JWT_SECRET || missingEnv.length > 0) {
        const message = missingEnv.length > 0
            ? `Missing required environment variables: ${missingEnv.join(", ")}`
            : "Failed to load env file";
        const error = new HttpError(message, 500);
        return next(error);
    }
    return next();
};
