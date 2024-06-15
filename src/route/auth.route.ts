import express from "express";

import { authController } from "../controllers";
import { verifyToken } from "../middleware/auth";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/logout", verifyToken, authController.logout);

export { authRouter };
