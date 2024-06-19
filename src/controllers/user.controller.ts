import { Request, Response } from "express";

import { postService, userService } from "../services";
import { success } from "../utils/response";

async function details(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const posts = await userService.getDetailsByUsername({ username });
    return res.status(200).json(success({ data: posts }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function getPosts(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const { posts, pagination } = await postService.listByUserId({
      page: page,
      pageSize: pageSize,
      userId,
    });

    return res.status(200).json(success({ data: posts, pagination }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export const userController = {
  details,
  getPosts,
};
