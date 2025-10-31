// backend/middlewares/error.middleware.js 
import { ApiError } from "../utils/api.Error.js";

export const errorHandler = (err, req, res, next) => {

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // For unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
