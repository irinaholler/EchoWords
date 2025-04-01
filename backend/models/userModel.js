import mongoose from "mongoose";

const { model, Schema } = mongoose;

const required = true;
const trim = true;
const unique = true;

const userSchema = new Schema({
    username: {
        type: String,
        required,
        unique
    },
    email: {
        type: String,
        required,
        unique,
        trim
    },
    password: {
        type: String,
        required,
        trim
    }
}, { timestamps: true });

const UserModel = model("User", userSchema);

export default UserModel;