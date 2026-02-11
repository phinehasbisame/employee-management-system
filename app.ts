import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./config/dotenv.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/users.route.js";
import HttpError from "./utils/http-error.js";
import roleRoute from "./routes/role.route.js";
import { checkForEnv } from "./middleware/env.middleware.js";
import { connectDatabase } from "./services/mongoose.service.js";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// create an express app instance
const app = express();

// middleware to handle env load
app.use(checkForEnv);

// connect app to database and display a text when database is connected successfully
await connectDatabase();

// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev"));
// }

// rate limit accept 100 request
const limiter = rateLimit({
  max: 100,
  windowMs: 1000,
});

app.use(limiter);

// use helmet middleware for security
app.use(helmet());

// accept json data
app.use(express.json());

// auth routes
app.use("/api/auth", authRoute);

// user management routes
app.use("/api/users", userRoute);

// role management routes
app.use("/api/roles", roleRoute);

// Handle error gracefully when one occurs using a middleware
app.use(
  (
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    if (response.headersSent) {
      return next(error);
    }
    response
      .status(error.code || 500)
      .json({ success: false, message: error.message });
  },
);

// throw this error if there is no route of that existing
app.use((request, response, next) => {
  const error = new HttpError(
    "Can't find route. Try checking your route again",
    400,
  );
  throw error;
});

// create a server to listen on a port
app.listen(PORT, () =>
  console.log(
    `Server running on port ${PORT}. Access via http://localhost:${PORT}`,
  ),
);
