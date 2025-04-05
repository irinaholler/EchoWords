import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { model, Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Hash password before updating
userSchema.pre("findOneAndUpdate", async function (next) {
    if (this._update?.password) {
        this._update.password = await bcrypt.hash(this._update.password, 12);
    }
    next();
});

// Password comparison method
userSchema.methods.isPasswordCorrect = async function (inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
};

// Remove sensitive data before sending response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

const UserModel = model("User", userSchema);

export default UserModel;
