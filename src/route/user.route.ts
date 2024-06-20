import express from "express";
import { userController } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth";
import { upload } from "../middleware/imageUpload";

const userRouter = express.Router();

userRouter.get("/:username", userController.details);
userRouter.get("/:userId/posts", userController.getPosts);
userRouter.put("/", verifyToken, upload.single("image"), userController.edit);
userRouter.put(
  "/removeProfileImage",
  verifyToken,
  userController.removeProfilePic
);

export { userRouter };
