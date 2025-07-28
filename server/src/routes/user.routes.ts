import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    AccessRefreshToken,
} from "../controllers/user.controllers";
import { upload } from "../middlewares/multer.middleware";
import { verifyjwt } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(

    upload.fields([
        { name: "profilePicture", maxCount: 1 },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyjwt, logoutUser);

router.route("/refresh-token").post(AccessRefreshToken);

export default router;
