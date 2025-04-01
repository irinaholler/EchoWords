import mongoose from "mongoose";
import slugify from "slugify";
import UserModel from "../models/userModel.js";
import PostModel from "../models/postModel.js";
import CommentModel from "../models/commentModel.js"; // Keep if used in future

// CREATE POST
export const createPost = async (req, res) => {
    try {
        console.log("Received post data:", req.body);
        const { title, description, username, userId, categories } = req.body;

        // Validate categories if it's a string
        let parsedCategories = categories;
        if (typeof categories === "string") {
            try {
                parsedCategories = JSON.parse(categories);
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid categories format. Must be a valid JSON array.",
                });
            }
        }

        // Check required fields
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }
        if (!username || !userId) {
            return res.status(400).json({
                success: false,
                message: "User information is missing (username, userId).",
            });
        }
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "Photo is required." });
        }

        // Ensure user exists
        const userExists = await UserModel.findById(userId);
        if (!userExists) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }

        // Create slug from title
        const slug = slugify(title.trim(), {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
        });

        // Create and save the post
        const newPost = new PostModel({
            title: title.trim(),
            slug,
            description: description.trim(),
            username,
            userId: new mongoose.Types.ObjectId(userId),
            categories: parsedCategories || [],
            photo: req.file.filename,
        });

        const savedPost = await newPost.save();
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: savedPost,
        });
    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error creating post",
        });
    }
};

// GET POST BY SLUG
export const detailsPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await PostModel.findOne({ slug });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// UPDATE POST IMAGE ONLY
export const updatePostImage = async (req, res) => {
    try {
        const { id: postId } = req.params;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded",
            });
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { photo: req.file.filename },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Post image updated successfully",
            data: updatedPost,
        });
    } catch (error) {
        console.error("Error in updatePostImage:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating post image",
        });
    }
};

// GET ALL POSTS (optionally filtered by ?search=...)
export const getPosts = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};

        if (search) {
            const searchRegex = new RegExp(search, "i"); // case-insensitive
            filter = {
                $or: [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { categories: { $regex: searchRegex } },
                ],
            };
        }

        const posts = await PostModel.find(filter).sort({ createdAt: -1 });

        // Ensure all posts have slugs
        const postsWithSlugs = await Promise.all(
            posts.map(async (post) => {
                if (!post.slug) {
                    const slug = slugify(post.title, {
                        lower: true,
                        strict: true,
                        remove: /[*+~.()'"!:@]/g,
                    });
                    post.slug = slug;
                    await post.save();
                }
                return post;
            })
        );

        return res.status(200).json({
            success: true,
            data: postsWithSlugs,
            message: "Posts fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching posts",
        });
    }
};

// UPDATE POST (including slug)
export const updatePost = async (req, res, next) => {
    try {
        // Always generate slug from the new title
        const slug = slugify(req.body.title || req.body.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
        });

        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, slug },
            { new: true, runValidators: true }
        );
        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
        });
    } catch (error) {
        next({ status: 400, message: error.message });
    }
};

// GET POST DETAILS (by _id)
export const detailsPost = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log("Fetching post with ID:", postId);

        // Validate postId format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            console.log("Invalid post ID format:", postId);
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format"
            });
        }

        const post = await PostModel.findById(postId).lean();
        if (!post) {
            console.log("Post not found with ID:", postId);
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        console.log("Found post:", post.title);

        // If post exists but has no slug, generate one
        if (!post.slug) {
            const slug = slugify(post.title, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g,
            });
            await PostModel.findByIdAndUpdate(postId, { slug });
            post.slug = slug;
        }

        // Get current username of post author
        if (post.userId) {
            try {
                console.log("Fetching user data for userId:", post.userId);
                const user = await UserModel.findById(post.userId);
                if (user) {
                    post.username = user.username;
                    console.log("Updated username for post:", user.username);
                } else {
                    console.log("User not found for userId:", post.userId);
                }
            } catch (userErr) {
                console.error("Error fetching user for post:", userErr);
            }
        }

        return res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error("Error in detailsPost:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching post details"
        });
    }
};

// GET USER'S POSTS
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await PostModel.find({ userId }).populate("userId", "username");
        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error("Error getting user posts:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE USER'S POSTS Username
export const updateAllPostsUsername = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newUsername } = req.body;

        // Validate
        if (!userId || !newUsername) {
            return res.status(400).json({
                success: false,
                message: "userId and newUsername are required",
            });
        }

        // Update all posts in DB with that userId
        const updated = await PostModel.updateMany(
            { userId },
            { $set: { username: newUsername } }
        );

        return res.status(200).json({
            success: true,
            message: "All posts updated with new username",
            updatedCount: updated.modifiedCount,
        });
    } catch (error) {
        console.error("Error updating posts with new username:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating posts for new username",
        });
    }
};

// DELETE POST
export const deletePost = async (req, res) => {
    try {
        const deletedPost = await PostModel.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
