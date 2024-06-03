import { database } from "../datasource";
import { Post } from "../entity/Post.entity";

const postRepository = database.getRepository(Post);

async function create({
  imageUrl,
  imageName,
  caption,
  userId,
}: {
  imageUrl: string;
  imageName: string;
  caption: string;
  userId: number;
}) {
  const post = postRepository.create({
    imageUrl,
    imageName,
    caption,
    user: {
      id: userId,
    },
  });

  await postRepository.save(post);
  return post;
}

async function list() {
  const posts = await postRepository.find();
  return posts;
}

async function view(userId: number) {
  const posts = await postRepository.find({
    relations: ["user"],
    where: {
      user: {
        id: userId,
      },
    },
  });

  return posts;
}

async function update(
  post: Post,
  values: { caption?: string; imageUrl?: string; imageName?: string }
) {
  const newPost = postRepository.merge(post, values);
  await postRepository.save(newPost);

  return newPost;
}

async function remove(post: Post) {
  const removedPost = await postRepository.remove(post);

  return removedPost;
}

async function getPost({ id, userId }: { id: number; userId: number }) {
  const post = await postRepository.findOne({
    where: {
      id: id,
      user: {
        id: userId,
      },
    },
  });
  return post;
}

async function getImage({
  id,
  userId: userId,
}: {
  id: number;
  userId: number;
}) {
  const image = await postRepository.findOne({
    where: {
      id: id,
      user: {
        id: userId,
      },
    },
  });
  return image;
}

export const postService = {
  create,
  list,
  view,
  update,
  remove,
  getPost,
  getImage,
};
