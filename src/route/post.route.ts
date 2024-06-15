import express from "express";

import { postController } from "../controllers";
import { verifyToken } from "../middleware/auth";
import { checkFileType, upload } from "../middleware/imageUpload";

const postRouter = express.Router();

postRouter.post(
  "/create",
  verifyToken,
  upload.single("image"),
  checkFileType,
  postController.create
);
postRouter.get("/", postController.list);
postRouter.get("/:uid", verifyToken, postController.viewPosts);

export { postRouter };
