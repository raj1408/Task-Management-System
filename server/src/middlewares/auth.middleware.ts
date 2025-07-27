import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// Initialize Prisma client
const prisma = new PrismaClient();

// Extend Request to include user
interface AuthenticatedRequest extends Request {
    user?: Omit<User, "password" | "refreshToken">;
}

const verifyjwt = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new ApiError(401, "Unauthorized request");
            }

            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET || ""
            ) as JwtPayload & { id?: string };

            if (!decodedToken.id) {
                throw new ApiError(401, "Invalid token payload");
            }

            const user = await prisma.user.findUnique({
                where: { id: decodedToken.id },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    profilePicture: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            if (!user) {
                throw new ApiError(401, "Invalid Access Token");
            }

            req.user = user;
            next();
        } catch (error: any) {
            next(new ApiError(401, error?.message || "Invalid access token"));
        }
    }
);

export { verifyjwt };
