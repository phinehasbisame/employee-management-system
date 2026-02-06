// Here is a centralized base for all env files
// Access all your env files from dotenv.ts
import dotenv from "dotenv";
// load env files using dotenv
dotenv.config();
const PORT = process.env.PORT || 5050;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
export { PORT, MONGODB_URI, JWT_SECRET };
