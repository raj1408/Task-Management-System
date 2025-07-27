import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// ✅ Utility to generate tokens
function generateTokens(user: { id: string; username: string; email: string }) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
        throw new Error("Token secrets must be defined in environment variables");
    }

    const accessToken = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        accessTokenSecret,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        refreshTokenSecret,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
}


// ✅ Register a user
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const profilePicture = req.body.profilePicture || null;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profilePicture,
            },
        });

        const { accessToken, refreshToken } = generateTokens(newUser);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Login user
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Logout user
export const logoutUser = (_req: Request, res: Response) => {
    // Invalidate tokens in client or DB if using refresh token rotation
    res.status(200).json({ message: "Logged out successfully" });
};

// ✅ Refresh access token
export const AccessRefreshToken = (req: Request, res: Response) => {
    const token = req.body.refreshToken;

    if (!token) return res.status(401).json({ message: "Refresh token required" });

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!refreshTokenSecret || !accessTokenSecret) {
        return res.status(500).json({ message: "Server configuration error" });
    }

    jwt.verify(token, refreshTokenSecret, (err: any, decoded: any) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        const accessToken = jwt.sign(
            { id: decoded.id },
            accessTokenSecret,
            { expiresIn: "1h" }
        );

        res.status(200).json({ accessToken });
    });
};
