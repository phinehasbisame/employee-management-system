import mongoose from "mongoose";
const roleSchemaDefinition = {
    name: {
        type: String,
        unique: true,
        required: true,
        uppercase: true
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
    },
};
// create roles schema
const roleSchema = new mongoose.Schema(roleSchemaDefinition);
// create role models
const Role = mongoose.model("Role", roleSchema);
export default Role;
