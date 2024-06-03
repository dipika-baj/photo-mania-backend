import { Request, Response } from "express";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
} from "../utils/constants";
import bcrypt from "bcrypt";
import { getToken } from "../utils/jwt";
import { authService } from "../services/auth.service";

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
      return res.status(400).json({
        message: "Empty field",
      });
    }

    if (!email.match(EMAIL_REGEX)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    if (!password.match(PASSWORD_REGEX)) {
      return res.status(400).json({
        message:
          "Password must contain minimum eight characters, at least one letter, one number and one special character",
      });
    }

    if (!username.match(USERNAME_REGEX)) {
      return res.status(400).json({
        message:
          "Username can only contain letters, digits, and underscores, must be minimum 7 character and start with letter or underscore.",
      });
    }

    const emailExists = await authService.findEmail(email);

    if (emailExists) {
      return res.status(400).json({
        message: "This email already exists.",
      });
    }

    const usernameExists = await authService.findUsername(username);

    if (usernameExists) {
      return res.status(400).json({
        message: "This username is already taken.",
      });
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

    return res.status(201).json({
      message: "User created",
      user: user.user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { email_username, password } = req.body;

    if (!email_username.trim()) {
      return res.status(400).json({
        message: "Email cannot be empty",
      });
    }

    const userPassword = await authService.findPassword(email_username);

    if (!userPassword) {
      return res.status(400).json({
        message: "Incorrect email or password",
      });
    }

    const passwordMatch = await bcrypt
      .compare(password, userPassword.password)
      .then((match) => {
        return match;
      });

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
      });
    }

    const userId = Number(await authService.findId(email_username));

    const token = await getToken(userId);

    return res.json({
      message: "User logged in",
      user: {
        id: userId,
        email_username: email_username,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
}
export const authController = { register, login };
