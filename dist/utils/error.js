import HttpError from "./http-error.js";
const throwError = (message, code, next) => {
    const error = new HttpError(message, code);
    return next(error);
};
export { throwError };
