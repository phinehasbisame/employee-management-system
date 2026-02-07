import mongoose from "mongoose";
// create user schema definition here
const userSchemaDefinition = {
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        immutable: true,
    },
};
// create user schema
const userSchema = new mongoose.Schema(userSchemaDefinition);
// create user models
const User = mongoose.model("User", userSchema);
export default User;
