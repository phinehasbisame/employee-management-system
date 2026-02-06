import mongoose from "mongoose";
// create a register schema
const registerSchemaDefinition = {
    fullName: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
    }
};
const loginSchemaDefinition = {
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
};
// creating login schema
const loginSchema = new mongoose.Schema(loginSchemaDefinition);
// creating register schema
const registerSchema = new mongoose.Schema(registerSchemaDefinition);
// create model for login schema
const Login = mongoose.model("Login", loginSchema);
// create model for register schema
const Register = mongoose.model("Register", registerSchema);
export { Register, Login };
