import { database } from "../datasource";
import { User } from "../entity/User.entity";

const userRepository = database.getRepository(User);

async function getDetails({ id }: { id: number }) {
  const user = await userRepository.findOne({
    where: {
      id: id,
    },
  });

  return user;
}

async function getDetailsByUsername({ username }: { username: string }) {
  const posts = await userRepository.findOne({
    where: {
      username: username,
    },
    relations: ["posts"],
  });

  return posts;
}

async function getProfilePicture({ id }: { id: number }) {
  const picture = await userRepository.findOne({
    where: {
      id: id,
    },
    select: {
      imageUrl: true,
    },
  });

  return picture;
}

async function update(
  user: User,
  values: {
    firstName?: string;
    lastName?: string;
    username?: string;
    imageUrl?: string;
    imageName?: string;
  }
) {
  const newUser = userRepository.merge(user, values);
  await userRepository.save(newUser);
  return newUser;
}

// async function removeProfilePic(user: User) {
//   const newUser = userRepository.merge(user, {
//     imageName: "",
//     imageUrl: "",
//   });
//   await userRepository.save(newUser);
//   return newUser;
// }

export const userService = {
  getDetails,
  getDetailsByUsername,
  getProfilePicture,
  update,
  // removeProfilePic,
};
