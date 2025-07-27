import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    AccessRefreshToken,
    updatePassword,
} from "../controllers/user.controllers";
import { upload } from "../middlewares/multer.middleware";
import { verifyjwt } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyjwt, logoutUser);

router.route("/refresh-token").post(AccessRefreshToken);

router.route("/login/update-password").post(verifyjwt, updatePassword);

export default router;
