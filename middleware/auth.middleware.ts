import { check } from "express-validator";

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

export { registerChecks, loginChecks };
