import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth";
import { postService } from "../services";
import { failure, success } from "../utils/response";

import fs from "fs";

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

async function update(req: AuthenticatedRequest, res: Response) {
  try {
    const postId = Number(req.params.postId);
    const userId = req.user!.id;
    const image = req.file;
    const imageUrl = image?.path;
    const imageName = image?.originalname;
    const caption = req.body.caption;
    let prev_image;

    const post = await postService.getPost({ postId, userId });

    if (!post) {
      return res
        .status(400)
        .json(failure({ message: "Post not found", code: "postNotFound" }));
    }
    if (imageUrl) {
      prev_image = await postService.getImage({ id: postId, userId });
    }
    const updatedPost = await postService.update(post, {
      imageUrl,
      imageName,
      caption,
    });

    if (prev_image) {
      fs.unlink(prev_image!.imageUrl, (err) => {
        if (err) {
          return res.status(500).json(
            failure({
              message: "Post could not be updated",
              code: "postNotUpdated",
            })
          );
        }
      });
    }

    return res.status(200).json(success({ data: updatedPost }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    const postId = Number(req.params.postId);
    const userId = req.user!.id;

    const post = await postService.getPost({ postId, userId });

    if (!post) {
      return res
        .status(404)
        .json(failure({ message: "Post not found", code: "postNotFound" }));
    }
    const deletedPost = await postService.remove(post);

    fs.unlink(deletedPost.imageUrl, (err) => {
      if (err) {
        return res.status(500).json(
          failure({
            message: "Post could not be deleted",
            code: "postNotDeleted",
          })
        );
      }
    });
    return res.status(200).json(success({ data: "success" }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export const postController = {
  create,
  list,
  details,
  update,
  remove,
};
