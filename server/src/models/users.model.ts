import { PrismaClient, User as PrismaUser } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

// Types for user creation input
interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    profilePicture?: string | null;
}

// Type for JWT payload (updated to use string for id)
interface JWTPayload extends JwtPayload {
    id: string;  // Changed from number to string
    username: string;
    email: string;
}

// Create a new user with hashed password
export async function createUser(data: CreateUserInput): Promise<PrismaUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            profilePicture: data.profilePicture ?? null,
        },
    });
}

// Validate input password against stored hashed password
export async function validatePassword(
    inputPassword: string,
    storedHashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedHashedPassword);
}

// Helper function to validate and get environment variables
function getEnvVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing ${name} in environment variables`);
    }
    return value;
}

// Generate Access Token with required fields
export function generateAccessToken(user: PrismaUser): string {
    const secret = getEnvVariable('ACCESS_TOKEN_SECRET');

    const payload: JWTPayload = {
        id: user.id.toString(),  // Convert number to string
        username: user.username,
        email: user.email,
    };

    return jwt.sign(payload, secret, { expiresIn: "1h" });
}

// Generate Refresh Token with user ID only
export function generateRefreshToken(user: PrismaUser): string {
    const secret = getEnvVariable('REFRESH_TOKEN_SECRET');
    const expiry = getEnvVariable('REFRESH_TOKEN_EXPIRY') || '7d'; // default fallback

    return jwt.sign(
        { id: user.id.toString() },  // Convert number to string
        secret,
        {
            expiresIn:
                "7d"
        }
    );
}

// Verify token function with proper typing
export function verifyToken(token: string, isRefreshToken = false): JWTPayload {
    const secret = isRefreshToken
        ? getEnvVariable('REFRESH_TOKEN_SECRET')
        : getEnvVariable('ACCESS_TOKEN_SECRET');

    try {
        return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}