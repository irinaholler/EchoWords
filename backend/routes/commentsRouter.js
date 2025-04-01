import express from "express";

import { createComment, updateComment, deleteComment, getPostComment } from "../controllers/commentController.js";
import { checkToken } from "../middleware/checkToken.js"

const commentRouter = express.Router();

commentRouter.route("/create").post(checkToken, createComment);
commentRouter.route("/:id").put(checkToken, updateComment);
commentRouter.route("/post/:postId").get(getPostComment);
commentRouter.route("/:id").delete(checkToken, deleteComment);



export default commentRouter;