import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.Error.js";
import { asynHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";

// ✅ Protect Route Middleware
export const protectRoute = asynHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized - No access token provided");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    console.log("Authenticated user:", user._id);
    next(); // ✅ proceed to next middleware
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized - Access token expired");
    }
    throw new ApiError(401, "Unauthorized - Invalid access token");
  }
});



// ✅ Admin Route Middleware
export const adminRoute = (req, res, next) => {
  console.log("Admin check");

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw new ApiError(403, "Access denied - Only admins can access");
  }
};
