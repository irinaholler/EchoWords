import express from "express";

import CommentModel from "../models/commentModel.js";


//CREATE
export const createComment = async (req, res) => {

    try {
        const newComment = await CommentModel.create({
            ...req.body,
            userId: req.body.userId
        });
        // console.log(req.body)
        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: newComment,
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//UPDATE
// GET http://localhost:7778/posts
export const updateComment = async (req, res, next) => {

    try {
        const updatedComment = await CommentModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedComment);
    } catch (error) {
        next({ status: 400, message: error.message });
    }
};

//DELETE
export const deleteComment = async (req, res) => {
    try {
        await CommentModel.findByIdAndDelete(req.params.id);

        res.status(200).json("Comment has been deleted!");

    } catch (error) {
        res.status(500).json(error);
    }
};

//GET POST COMMENTS
export const getPostComment = async (req, res) => {
    try {
        const comments = await CommentModel.find({ postId: req.params.postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
};