import express from "express";

import {
    createPost,
    getPosts,
    updatePost,
    detailsPost,
    getUserPosts,
    updatePostImage,
    updateAllPostsUsername,
    deletePost,
    detailsPostBySlug,
} from "../controllers/postController.js";
import { checkToken } from "../middleware/checkToken.js";
import { uploadPostImage } from "../utils/multerConfig.js";

const postRouter = express.Router();

// Create a new post
postRouter.post("/create", checkToken, uploadPostImage.single("photo"), createPost);

// Get all posts
postRouter.get("/", getPosts);

// Get post by slug
postRouter.get("/slug/:slug", detailsPostBySlug);

// Get user's posts
postRouter.get("/user/:userId", getUserPosts);

// Get post details by ID (important to add)
postRouter.get("/:id", detailsPost);

// Update post
postRouter.put("/:id", checkToken, updatePost);

// Update post image
postRouter.patch("/:id/profile-picture", checkToken, uploadPostImage.single("photo"), updatePostImage);

// Update post username
postRouter.patch("/updateUsername/:userId", checkToken, updateAllPostsUsername);

// Delete post
postRouter.delete("/:id", checkToken, deletePost);

export default postRouter;
