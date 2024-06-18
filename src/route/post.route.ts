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
//TODO :middleware for pagination
postRouter.get("/", postController.list);

postRouter.get("/:postId", postController.details);

//TODO :fix route
postRouter.get("/:uid", verifyToken, postController.listByUserId);

export { postRouter };
