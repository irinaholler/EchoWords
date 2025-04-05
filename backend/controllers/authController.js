import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from 'http-errors';
import UserModel from "../models/userModel.js";

// SIGNUP
export const signup = async (req, res, next) => {
    try {
        // Validation
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw createError(400, "All fields are required.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw createError(409, "Email already in use.");
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Store the new user
        const user = await UserModel.create({
            username,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "Login successful",
            data: { username: user.username, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw createError(400, "Please provide email and password.");
        }

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw createError(404, "User not found.");
        }

        // Compare passwords
        const isMatch = await user.isPasswordCorrect(password, user.password);
        if (!isMatch) {
            throw createError(401, "Invalid credentials.");
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        // Store the token in a cookie with name "token"
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// LOGOUT
export const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", { httpOnly: true });

        res.status(200).json({
            success: true,
            message: "User was successfully Logged Out"
        });
    } catch (error) {
        next(error);
    }
};

// REFETCH USER
export const refetch = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided." });
        }

        // Verify Token
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findById(data.userId).select('-password');

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found." });
            }

            res.status(200).json({ success: true, data: user });
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }
    } catch (error) {
        next(error);
    }
};


export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = user._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    name.toLowerCase().split(' ').join('') +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = newUser._doc;
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};