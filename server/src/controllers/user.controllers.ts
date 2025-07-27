import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Users } from "../models/users.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

// Utility: Generate Tokens
const generateAccessTokenAndRefreshToken = async (
    userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user = await Users.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating Access and Refresh Token"
        );
    }
};

// Register
const registerUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { fullName, email, username, password } = req.body;

        if (
            [fullName, email, username, password].some(
                (field) => !field?.trim?.()
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await Users.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            throw new ApiError(409, "Username/email already registered");
        }

        const avatarLocalPath = req?.files?.avatar?.[0]?.path;
        let coverImageLocalPath: string | undefined;

        if (req?.files?.coverImage?.[0]?.path) {
            coverImageLocalPath = req.files.coverImage[0].path;
        }

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = coverImageLocalPath
            ? await uploadOnCloudinary(coverImageLocalPath)
            : undefined;

        if (!avatar) {
            throw new ApiError(400, "Avatar upload failed");
        }

        const user = await Users.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url,
            email,
            password,
            username: username.toLowerCase(),
        });

        const createdUser = await Users.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(500, "User creation failed");
        }

        return res
            .status(201)
            .json(new ApiResponse(201, createdUser, "Registered successfully"));
    }
);

// Login
const loginUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { username, email, password } = req.body;

        if (!(username || email)) {
            throw new ApiError(401, "Email/Username is required for login");
        }

        const user = await Users.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (!password) {
            throw new ApiError(401, "Password is required");
        }

        const isValid = await user.isPasswordCorrect(password);

        if (!isValid) {
            throw new ApiError(401, "Invalid credentials");
        }

        const { accessToken, refreshToken } =
            await generateAccessTokenAndRefreshToken(user._id);

        const loggedInUser = await Users.findById(user._id).select(
            "-password -refreshToken"
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(201, {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                }, "Logged in successfully!")
            );
    }
);

// Refresh Token
const AccessRefreshToken = asyncHandler(
    async (req: Request, res: Response) => {
        const UserRefreshToken =
            req.cookies?.refreshToken || req.body?.refreshToken;

        if (!UserRefreshToken) {
            throw new ApiError(401, "Unauthorized Request");
        }

        try {
            const decodedRefreshToken = jwt.verify(
                UserRefreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as { _id: string };

            const user = await Users.findById(decodedRefreshToken._id);

            if (!user || UserRefreshToken !== user.refreshToken) {
                throw new ApiError(401, "Invalid or expired refresh token");
            }

            const { accessToken, refreshToken: newRefreshToken } =
                await generateAccessTokenAndRefreshToken(user._id);

            const options = {
                httpOnly: true,
                secure: true,
            };

            return res
                .status(201)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", newRefreshToken, options)
                .json(
                    new ApiResponse(201, { accessToken, newRefreshToken }, "Token refreshed")
                );
        } catch (error: any) {
            throw new ApiError(401, error?.message || "Unauthorized Request");
        }
    }
);

// Logout
const logoutUser = asyncHandler(
    async (req: Request, res: Response) => {
        await Users.findByIdAndUpdate(req.user._id, {
            $set: { refreshToken: 1 },
        });

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "Logged out successfully"));
    }
);

// Update Password
const updatePassword = asyncHandler(
    async (req: Request, res: Response) => {
        const user = await Users.findById(req.user?._id);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw new ApiError(401, "Old and new password are required");
        }

        const isValid = await user.isPasswordCorrect(oldPassword);

        if (!isValid) {
            throw new ApiError(401, "Old password is incorrect");
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password updated successfully"));
    }
);

export {
    registerUser,
    loginUser,
    logoutUser,
    AccessRefreshToken,
    updatePassword,
};
