import { Response } from "express";
import fs from "fs";

import { AuthenticatedRequest } from "../middleware/auth";
import { authService, postService } from "../services";
import { userService } from "../services/user.service";
import { failure, success } from "../utils/response";
import { USERNAME_REGEX } from "../utils/constants";

// async function viewPosts(req: AuthenticatedRequest, res: Response) {
//   try {
//     const userId = Number(req.user!.id);
//     const posts = await postService.listByUserId({ userId, page });
//     return res.status(200).json(success({ data: posts }));
//   } catch (err) {
//     return res.status(500).json({
//       message: err,
//     });
//   }
// }

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

async function updatePost(req: AuthenticatedRequest, res: Response) {
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

async function deletePost(req: AuthenticatedRequest, res: Response) {
  try {
    const postId = Number(req.params.id);
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

async function edit(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.user!.id;
    const image = req.file;
    const imageUrl = image?.path;
    const imageName = image?.originalname;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    let prevImage;

    const user = await userService.getDetails({ id });

    if (!user) {
      return res
        .status(400)
        .json(failure({ message: "User not found", code: "userNotFound" }));
    }
    if (username && user.username !== username) {
      if (!username.match(USERNAME_REGEX)) {
        return res.status(400).json(
          failure({
            code: "username",
            message:
              "Username can only contain letters, digits, and underscores, must be minimum 7 character and start with letter or underscore.",
          })
        );
      }

      const usernameExists = await authService.findUsername(username);

      if (usernameExists) {
        return res.status(400).json(
          failure({
            code: "username",
            message: "This username is already taken.",
          })
        );
      }
    }

    if (imageUrl) {
      prevImage = await userService.getProfilePicture({ id });
    }

    const updatedUser = await userService.update(user, {
      lastName,
      firstName,
      username,
      imageName,
      imageUrl,
    });

    if (prevImage?.imageUrl) {
      fs.unlink(prevImage!.imageUrl, (err) => {
        if (err) {
          return res.status(500).json(
            failure({
              message: "Profile could not be updated",
              code: "profileNotUpdated",
            })
          );
        }
      });
    }

    return res.status(200).json(success({ data: updatedUser }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function removeProfilePic(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.user!.id;
    const user = await userService.getDetails({ id });

    if (!user) {
      return res
        .status(400)
        .json(failure({ message: "User not found", code: "userNotFound" }));
    }

    const prevImage = await userService.getProfilePicture({ id });

    const updatedUser = await userService.update(user, {
      imageUrl: "",
      imageName: "",
    });

    if (prevImage?.imageUrl) {
      fs.unlink(prevImage.imageUrl, (err) => {
        if (err) {
          return res.status(500).json(
            failure({
              message: "Profile could not be updated",
              code: "profileNotUpdated",
            })
          );
        }
      });
    }
    return res.status(200).json(success({ data: updatedUser }));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export const meController = {
  // viewPosts,
  getDetails,
  updatePost,
  deletePost,
  edit,
  removeProfilePic,
};
