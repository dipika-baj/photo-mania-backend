import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { postService } from "../services";
import { userService } from "../services/user.service";
import fs from "fs";
import { log } from "console";

async function viewPosts(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = Number(req.user!.id);
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

async function getDetails(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = Number(req.user!.id);
    const userDetails = await userService.getDetails(userId);
    if (!userDetails) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      user: userDetails,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function updatePost(req: AuthenticatedRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;
    const image = req.file;
    const imageUrl = image?.path;
    const imageName = image?.originalname;
    const caption = req.body.caption;
    let prev_image;

    const post = await postService.getPost({ id, userId });

    if (!post) {
      return res.status(400).json({
        message: "Post not found",
      });
    }
    if (imageUrl) {
      prev_image = await postService.getImage({ id, userId });
    }
    const updatedPost = await postService.update(post, {
      imageUrl,
      imageName,
      caption,
    });

    if (prev_image) {
      fs.unlink(prev_image!.imageUrl, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Post could not be deleted",
          });
        }
      });
    }

    return res.status(200).json({
      message: `Post ${id} by ${userId} updated`,
      post: updatedPost,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function deletePost(req: AuthenticatedRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const post = await postService.getPost({ id, userId });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    const deletedPost = await postService.remove(post);

    if (!deletedPost) {
      throw new Error("Post could not be deleted");
    }

    fs.unlink(deletedPost.imageUrl, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Post could not be deleted",
        });
      }
    });
    return res.status(200).json({
      message: `Post ${id} by user ${userId} deleted`,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function logout(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;

    res.status(200).json({
      message: `User ${userId} has been logged out`,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
}

export const meController = {
  viewPosts,
  getDetails,
  updatePost,
  deletePost,
  logout,
};
