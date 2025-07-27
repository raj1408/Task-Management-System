import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function createUser(data: {
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
}): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            profilePicture: data.profilePicture,
        },
    });
}

export async function validatePassword(
    inputPassword: string,
    storedHashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedHashedPassword);
}

export function generateAccessToken(user: User): string {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}

export function generateRefreshToken(user: User): string {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
}
