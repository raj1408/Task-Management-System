import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Users, UserDocument } from "../models/users.model";
import { Request, Response, NextFunction } from "express";

// Extend Request interface to add user property
interface AuthenticatedRequest extends Request {
    user?: UserDocument;
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
            ) as JwtPayload & { _id?: string };

            if (!decodedToken._id) {
                throw new ApiError(401, "Invalid token payload");
            }

            const user = await Users.findById(decodedToken._id).select(
                "-password -refreshToken"
            );

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
