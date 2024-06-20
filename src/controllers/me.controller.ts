import { Response } from "express";
import fs from "fs";

import { AuthenticatedRequest } from "../middleware/auth";
import { authService, postService } from "../services";
import { userService } from "../services/user.service";
import { failure, success } from "../utils/response";
import { USERNAME_REGEX } from "../utils/constants";

async function listPosts(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = Number(req.user!.id);
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const { posts, pagination } = await postService.listByUserId({
      userId,
      page,
      pageSize,
    });
    return res.status(200).json(success({ data: posts, pagination }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function getDetails(req: AuthenticatedRequest, res: Response) {
  try {
    const id = Number(req.user!.id);
    const userDetails = await userService.getDetails({ id });
    if (!userDetails) {
      return res
        .status(404)
        .json(failure({ message: "User not found", code: "userNotFound" }));
    }
    return res.status(200).json(success({ data: userDetails }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export const meController = {
  listPosts,
  getDetails,
};
