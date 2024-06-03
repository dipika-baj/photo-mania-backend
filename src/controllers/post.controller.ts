import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { postService } from "../services";

async function create(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const image = req.file;
    const imageUrl = image?.path as string;
    const imageName = image?.originalname as string;
    const caption = req.body.caption;

    if (!image) {
      return res.status(400).json({
        message: "Post cannot be empty",
      });
    }

    if (image!.mimetype.split("/")[0] !== "image") {
      return res.status(400).json({
        message: "Attachment can only be image",
      });
    }

    const post = await postService.create({
      userId,
      imageUrl,
      imageName,
      caption,
    });
    return res.status(201).json({
      message: "Post created",
      post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
}

async function list(req: Request, res: Response) {
  try {
    const posts = await postService.list();
    return res.status(200).json({
      posts,
    });
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
    return res.status(200).json({
      posts,
    });
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
