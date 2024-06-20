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

postRouter.put(
  "/:postId",
  verifyToken,
  upload.single("image"),
  postController.update
);

postRouter.delete("/:postId", verifyToken, postController.remove);

export { postRouter };
