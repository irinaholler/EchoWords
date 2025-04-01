import mongoose from "mongoose";

const { model, Schema } = mongoose;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const CommentModel = model("Comment", commentSchema);

export default CommentModel;