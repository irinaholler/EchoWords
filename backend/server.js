//build
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from "url";

import connectDB from "./utils/db.js";
import {
    globalErrorHandler,
    routeNotFound,
} from "./middleware/errorHandlers.js";
import authRouter from "./routes/authRouter.js";
import usersRouter from "./routes/usersRouter.js";
import postRouter from "./routes/postsRouter.js";
import commentRouter from "./routes/commentsRouter.js";
import { checkToken } from "./middleware/checkToken.js";

// These two lines are needed in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();
const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Serve static files (posts + profiles)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", checkToken, postRouter);
app.use("/api/comments", commentRouter);

// Serve Frontend (for Render deployment)
app.use(express.static(path.join(__dirname, 'public', 'dist')));
// For SPA routing (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

// Global ERROR Handler
app.use(routeNotFound);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server is up and running!\n` +
        `🌐 Listening on http://localhost:${PORT}\n` +
        `📅 Started at: ${new Date().toLocaleString()}\n`
    );
});