import { Request, Response } from "express";

import fs from "fs";

import { authService, postService, userService } from "../services";
import { failure, success } from "../utils/response";
import { AuthenticatedRequest } from "../middleware/auth";
import { USERNAME_REGEX } from "../utils/constants";

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

export const userController = {
  details,
  getPosts,
  edit,
  removeProfilePic,
};
