import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { authService } from "../services/auth.service";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from "../utils/constants";
import { getToken } from "../utils/jwt";
import { failure, success } from "../utils/response";

async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, username } = req.body;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !username.trim()
    ) {
      return res.status(400).json(failure({ message: "Empty Fields" }));
    }

    if (!email.match(EMAIL_REGEX)) {
      return res.status(400).json(failure({ message: "Invalid email" }));
    }

    if (!password.match(PASSWORD_REGEX)) {
      return res.status(400).json(
        failure({
          message:
            "Password must contain minimum eight characters, at least one letter, one number and one special character",
        })
      );
      0;
    }

    if (!username.match(USERNAME_REGEX)) {
      return res.status(400).json(
        failure({
          code: "username",
          message:
            "Username can only contain letters, digits, and underscores, must be minimum 7 character and start with letter or underscore.",
        })
      );
    }

    const emailExists = await authService.findEmail(email);

    if (emailExists) {
      return res
        .status(400)
        .json(
          failure({ code: "email", message: "This email already exists." })
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

    const encryptedPassword = await bcrypt
      .hash(password, 10)
      .then((hash): string => {
        return hash;
      });

    const user = await authService.register({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      username,
    });

    return res.status(201).json(success(user.user));
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { emailUsername, password } = req.body;

    if (!emailUsername.trim()) {
      return res.status(400).json({
        message: "Email cannot be empty",
      });
    }

    const userPassword = await authService.findPassword(emailUsername);

    if (!userPassword) {
      return res.status(400).json(
        failure({
          code: "incorrect",
          message: "Incorrect email or password",
        })
      );
    }

    const passwordMatch = await bcrypt
      .compare(password, userPassword.password)
      .then((match) => {
        return match;
      });

    if (!passwordMatch) {
      return res.status(400).json(
        failure({
          code: "incorrect",
          message: "Incorrect email or password",
        })
      );
    }

    const userId = Number(await authService.findId(emailUsername));

    const token = await getToken(userId);

    return res.json(
      success({
        id: userId,
        emailUsername: emailUsername,
        token: token,
      })
    );
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

async function logout(req: Request, res: Response) {
  try {
    res.status(200).json(success("sucess"));
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
}
export const authController = { register, login, logout };
