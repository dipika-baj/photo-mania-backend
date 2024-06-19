import express from "express";
import { userController } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/:username", userController.details);
userRouter.get("/:userId/posts", userController.getPosts);

export { userRouter };
