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

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

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
  try {
    const { email, password, name } = req.body;


    if ([email, name, password].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }


    const userExist = await User.findOne({
      $or: [{ name }, { email }],
    });

    if (userExist) {
      throw new ApiError(409, "User already exists");
    }


    let user = await User.create({
      name,
      email,
      password,
    });


    // Generate tokens and store refresh token
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);


    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        success: true,
        message: "User signed up successfully",
      });

  } catch (error) {
    throw new ApiError(401, error?.message || "Failed to create user");
  }
});





export const login = asynHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);

      await storeRefreshToken(user._id, refreshToken);
      return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          success: true,
          message: "User login sucessfully",
        });
    }

  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
});





export const logout = asynHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ messae: "User logout successfully" });

  } catch (error) {
    throw new ApiError(500, "server error ");
  }
});






export const refreshToken = asynHandler(async (req, res) => {
  console.log("coming1");
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh Token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    console.log("coming in 3");

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Inavlid refresh Token" });
    }


    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );


    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      }).json({ messae: "Token refresh successfully" });

  } catch (error) {
    throw new ApiError(500, "server error", error.messae);
  }
});
