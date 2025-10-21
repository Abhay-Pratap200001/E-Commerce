import User from "../models/User.model.js";
import { ApiError } from "../utils/api.Error.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import { asynHandler } from "../utils/asyncHandler.js";

// Generate Access and Refresh Tokens
const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "16m",
  });

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

// Store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 // 7 days
  );
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};


// Signup controller
export const signup = asynHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Validate input
  if ([email, name, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const userExist = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (userExist) {
    throw new ApiError(409, "User already exists");
  }

  // Create new user
  let user = await User.create({
    name,
    email,
    password,
  });

 
  // Generate tokens and store refresh token
  const { accessToken, refreshToken } = generateToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  // Respond to client including timestamps and populated products
  return res.status(201).cookie("accessToken", accessToken, cookieOptions).cookie("refreshToken", refreshToken, cookieOptions)
  .json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // cartItems: user.cartItems,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      success: true,
      message: "User signed up successfully",
    });
});



export const login = asynHandler(async (req, res) => {
  res.send("login");
});

export const logout = asynHandler(async (req, res) => {
  res.send("logout");
});
