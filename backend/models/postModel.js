import mongoose from "mongoose";

const { model, Schema } = mongoose;

const required = true;
const trim = true;
const unique = true;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: {
        type: Array,
        default: []
    },
    photo: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

const PostModel = model("Post", postSchema);

export default PostModel;