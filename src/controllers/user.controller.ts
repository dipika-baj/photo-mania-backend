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

export const userController = {
  details,
};
