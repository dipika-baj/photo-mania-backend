import { database } from "../datasource";
import { User } from "../entity/User.entity";

const userRepository = database.getRepository(User);

async function register({
  firstName,
  lastName,
  email,
  password,
  username,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
}) {
  const user = userRepository.create({
    firstName,
    lastName,
    email,
    password,
    username,
  });
  await userRepository.save(user);
  const userWithoutPassword = { ...user, password: undefined };
  return {
    user: userWithoutPassword,
  };
}

async function findEmail(email: string) {
  const userEmail = await userRepository.findOne({
    select: {
      email: true,
    },
    where: [
      {
        email: email,
      },
    ],
  });

  return userEmail;
}

async function findUsername(username: string) {
  const userEmail = await userRepository.findOne({
    select: {
      username: true,
    },
    where: {
      username: username,
    },
  });

  return userEmail;
}

async function findPassword(emailUsername: string) {
  const userPassword = await userRepository.findOne({
    select: {
      password: true,
    },
    where: [
      {
        email: emailUsername,
      },
      {
        username: emailUsername,
      },
    ],
  });

  return userPassword;
}

async function findId(emailUsername: string) {
  const userId = await userRepository.findOne({
    select: {
      id: true,
    },
    where: [
      {
        email: emailUsername,
      },
      {
        username: emailUsername,
      },
    ],
  });
  return userId?.id;
}

export const authService = {
  register,
  findEmail,
  findUsername,
  findId,
  findPassword,
};
