import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { postService } from "../services";
import { failure, success } from "../utils/response";

async function create(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const image = req.file;

    if (!image) {
      return res
        .status(400)
        .json(failure({ message: "Post cannot be empty", code: "emptyPost" }));
    }

    const imageUrl = image.path;
    const imageName = image.originalname;
    const caption = req.body.caption;

    if (image.mimetype.split("/")[0] !== "image") {
      return res.status(400).json(
        failure({
          message: "Attachment can only be image",
          code: "invalidAttachment",
        })
      );
    }

    const post = await postService.create({
      userId,
      imageUrl,
      imageName,
      caption,
    });

    return res.status(201).json(success({ data: post }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function list(req: Request, res: Response) {
  try {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    const { posts, pagination } = await postService.list({
      page: page,
      pageSize: pageSize,
    });

    return res
      .status(200)
      .json(success({ data: posts, pagination: pagination }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function listByUserId(req: Request, res: Response) {
  try {
    const userId = Number(req.params.uid);
    const posts = await postService.view(userId);
    return res.status(200).json(success({ data: posts }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function details(req: Request, res: Response) {
  try {
    const postId = Number(req.params.postId);
    const posts = await postService.details({ postId });
    return res.status(200).json(success({ data: posts }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export const postController = {
  create,
  list,
  listByUserId,
  details,
};
