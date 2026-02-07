import express from "express";
import { MONGODB_URI, PORT } from "./config/dotenv.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/users.route.js";
import mongoose from "mongoose";
import HttpError from "./utils/http-error.js";
import roleRoute from "./routes/role.route.js";
// create an express app instance
const app = express();
// connect app to database and display a text when database is connected successfully
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to database successfully"))
    .catch((err) => console.log(err.message));
// accept json data
app.use(express.json());
// auth routes
app.use("/api/auth", authRoute);
// user management routes
app.use("/api/users", userRoute);
// role management routes
app.use("/api/roles", roleRoute);
// Handle error gracefully when one occurs using a middleware
app.use((error, request, response, next) => {
    if (response.headersSent) {
        return next(error);
    }
    response
        .status(error.code || 500)
        .json({ success: false, message: error.message });
});
// throw this error if there is no route of that existing
app.use((request, response, next) => {
    const error = new HttpError("Can't find route. Try checking your route again", 400);
    throw error;
});
// create a server to listen on a port
app.listen(PORT, () => console.log(`Server running on port ${PORT}. Access via http://localhost:${PORT}`));
