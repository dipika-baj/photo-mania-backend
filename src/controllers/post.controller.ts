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

    return res.status(201).json(success(post));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function list(req: Request, res: Response) {
  try {
    const posts = await postService.list();
    return res.status(200).json(success(posts));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function viewPosts(req: Request, res: Response) {
  try {
    const userId = Number(req.params.uid);
    const posts = await postService.view(userId);
    return res.status(200).json(success(posts));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export const postController = {
  create,
  list,
  viewPosts,
};
