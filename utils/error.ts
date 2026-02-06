import { NextFunction } from "express";
import HttpError from "./http-error.js";

const throwError = (message: string, code: number, next: NextFunction) => {
  const error = new HttpError(message, code);
  return next(error);
};
 export {
  throwError
 }