import { database } from "../datasource";
import { User } from "../entity/User.entity";

const userRepository = database.getRepository(User);

async function getDetails({ userId }: { userId: number }) {
  const posts = await userRepository.find({
    where: {
      id: userId,
    },
  });

  return posts;
}

async function getDetailsByUsername({ username }: { username: string }) {
  const posts = await userRepository.find({
    where: {
      username: username,
    },
  });

  return posts;
}

export const userService = {
  getDetails,
  getDetailsByUsername,
};
