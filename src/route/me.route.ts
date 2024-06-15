import express from "express";

import { meController } from "../controllers/me.controller";
import { verifyToken } from "../middleware/auth";
import { upload } from "../middleware/imageUpload";

const meRouter = express.Router();

meRouter.get("/posts", verifyToken, meController.viewPosts);
meRouter.get("/user", verifyToken, meController.getDetails);
meRouter.put(
  "/post/:id",
  verifyToken,
  upload.single("image"),
  meController.updatePost
);
meRouter.delete("/post/:id", verifyToken, meController.deletePost);

// TODO: Fix route
export { meRouter };
