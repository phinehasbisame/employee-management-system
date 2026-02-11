import mongoose from "mongoose";
import { MONGODB_URI } from "../config/dotenv.js";
export const connectDatabase = async () => {
    // connect app to database and display a text when database is connected successfully
    try {
        const connect = await mongoose.connect(MONGODB_URI);
        if (connect) {
            console.log("Connected to database successfully");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
};
