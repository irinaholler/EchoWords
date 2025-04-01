import jwt from "jsonwebtoken";
import createError from "http-errors";
import "dotenv/config";

import UserModel from "../models/userModel.js";


export const checkToken = async (req, res, next) => {
    console.log("Incoming request cookies:", req.cookies);
    try {
        // Check if cookies exist
        // console.log("To see if its working", process.env.JWT_SECRET);
        if (!req.cookies) {
            throw createError(401, "No cookies found in request");
        }

        // Extract token from the Authorization header
        const token = req.cookies.token;
        console.log("JWT Token found:", !!token);

        // If no token is provided, return an error
        if (!token) {
            return res.status(401).json({ message: "JWT must be provided" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the authenticated user in DB
        const user = await UserModel.findById(decoded.userId).select("-password");

        if (!user) {
            throw createError(401, "User no longer exists");
        }

        // Attach user data to the request object for further use
        req.user = user;
        req.isAuthenticated = true;

        // Continue to the next middleware or route handler
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token", error: err.message });
    }
};