import express from "express";

import { signup, login, logout, refetch, google } from "../controllers/authController.js";
import UserModel from "../models/userModel.js";
import { checkToken } from "../middleware/checkToken.js";


const authRouter = express.Router();

// GET All users
// GET http://localhost:7778/api/auth
authRouter.get("/", async (req, res, next) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next({ status: 500, message: error.message });
    }
});

// Auth routes
authRouter.post("/register", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/refetch", checkToken, refetch);
authRouter.post("/google", google);

export default authRouter;