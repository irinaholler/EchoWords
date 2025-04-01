import express from "express";
import {
    test,
    updateUser,
    deleteUser,
    getUser,
    getUserByUsername,
    uploadProfilePicture,
    updateProfilePicture
} from "../controllers/userController.js";
import { uploadProfileImage } from "../utils/multerConfig.js";
import { checkToken } from "../middleware/checkToken.js";
import UserModel from "../models/userModel.js";


const usersRouter = express.Router();

// Public route - anyone can access all users
usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await UserModel.find().select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
});

// TEST
usersRouter.get('/test', test);

// UPDATE USER
usersRouter.patch("/:id", checkToken, updateUser);

// DELETE USER
usersRouter.delete("/:id", checkToken, deleteUser);

// GET USER
//usersRouter.get("/:id", getUser);
usersRouter.get('/username/:username', getUserByUsername);

// Upload Profile Picture (using req.params.id)
usersRouter.patch("/:id/profile-picture", checkToken, uploadProfileImage.single("photo"), uploadProfilePicture);

// Optional: an alternate if updating by body.userId
usersRouter.put("/profile-picture", checkToken, uploadProfileImage.single("photo"), updateProfilePicture);


export default usersRouter;
