import { database } from "../datasource";
import { Post } from "../entity/Post.entity";
import { getPagination } from "../utils/pagination";

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

async function list({ pageSize, page }: { pageSize: number; page: number }) {
  const [posts, count] = await postRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
    relations: ["user"],
    order: {
      createdAt: "DESC",
    },
  });
  //TODO:reusable function for limit and offset

  const pagination = getPagination({ count, page, pageSize });

  return { posts, pagination };
}

async function listByUserId({
  pageSize,
  page,
  userId,
}: {
  pageSize: number;
  page: number;
  userId: number;
}) {
  const [posts, count] = await postRepository.findAndCount({
    where: {
      user: {
        id: userId,
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    order: {
      createdAt: "DESC",
    },
  });
  const pagination = getPagination({ count, page, pageSize });

  return { posts, pagination };
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

async function getPost({ postId, userId }: { postId: number; userId: number }) {
  const post = await postRepository.findOne({
    where: {
      id: postId,
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

async function details({ postId }: { postId: number }) {
  const post = await postRepository.find({
    where: {
      id: postId,
    },
    relations: ["user"],
  });
  return post;
}

export const postService = {
  create,
  list,
  listByUserId,
  update,
  remove,
  getPost,
  getImage,
  details,
};
