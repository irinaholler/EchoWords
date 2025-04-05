import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import UserModel from "../models/userModel.js";
import Post from "../models/postModel.js";

// TEST
export const test = (req, res) => {
    res.json({ message: "API is working!" });
};

// UPDATE USER
export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        //if (req.user.id !== userId) {
        //    return next(createError(403, "You are not allowed to update this user"));
        //}
        const { username, email, password } = req.body;

        // --- Validate username ---
        if (username) {
            if (username.length < 3 || username.length > 20) {
                return next(createError(400, "Username must be between 3 and 20 characters"));
            }
            if (username.includes(" ")) {
                return next(createError(400, "Username cannot contain spaces"));
            }
            if (username !== username.toLowerCase()) {
                return next(createError(400, "Username must be lowercase. Please enter your username in all lowercase letters."));
            }
            user.username = username;
        }

        // --- Validate and set email ---
        if (email) {
            user.email = email;
        }

        // --- Validate and set password ---
        if (password) {
            if (password.length < 4) {
                return next(createError(400, "Password must be at least 6 characters"));
            }
            user.password = password; // This will be hashed by `pre("save")`
        }

        // --- Save updated user ---
        const updatedUser = await user.save();

        if (!updatedUser) {
            return next(createError(404, "User NOT Found!"));
        }

        // Update all posts for this user with the new username.
        if (username) {
            await Post.updateMany(
                { userId: userId },
                { $set: { username: req.body.username } }
            );
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE USER
export const deleteUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return next(createError(403, "You can only delete your own account"));
        }

        await UserModel.findByIdAndDelete(req.params.id);
        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "User has been deleted",
        });
    } catch (error) {
        next(error);
    }
};

// GET USER
export const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }

        const { password, ...info } = user._doc;
        res.status(200).json(info);
    } catch (error) {
        next(error);
    }
};

export const getUserByUsername = async (req, res, next) => {
    try {
        const username = req.params.username.toLowerCase();
        const user = await UserModel.findOne({ username: new RegExp(`^${username}$`, 'i') });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const { password, ...info } = user._doc;
        res.status(200).json({ success: true, data: info });
    } catch (err) {
        next(err);
    }
};

// UPLOAD PROFILE PICTURE (using req.params.id)
export const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) return next(createError(400, "No file uploaded"));

        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            { profilePic: `/uploads/profiles/${req.file.filename}` }, // Updated path
            { new: true }
        );

        if (!user) return next(createError(404, "User not found"));

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE PROFILE PICTURE via req.body.userId (OPTIONAL)
export const updateProfilePicture = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        if (!userId) return next(createError(400, "User ID is required"));

        if (!req.file) return next(createError(400, "No profile picture uploaded."));

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { profilePic: `/uploads/profiles/${req.file.filename}` }, // Updated path
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile picture updated",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};