import express from "express";

import { meController } from "../controllers/me.controller";
import { verifyToken } from "../middleware/auth";
import { upload } from "../middleware/imageUpload";

const meRouter = express.Router();

meRouter.get("/posts", verifyToken, meController.listPosts);
meRouter.get("/", verifyToken, meController.getDetails);

export { meRouter };
