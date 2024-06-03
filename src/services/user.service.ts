import { database } from "../datasource";
import { User } from "../entity/User.entity";

const userRepository = database.getRepository(User);
async function getDetails(userId: number) {
  const posts = await userRepository.find({
    where: {
      id: userId,
    },
  });

  return posts;
}

export const userService = {
  getDetails,
};
