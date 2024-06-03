import express, { Request } from "express";
import { verifyToken } from "../middleware/auth";
import { meController } from "../controllers/me.controller";
import { upload } from "../middleware/imageUpload";
import { authController } from "../controllers";

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
meRouter.delete("/logout", verifyToken, meController.logout);

export { meRouter };
