import { posts, users } from "../../data.js";

export const Comment = {
  post: async (parent, args, { _db }) => {
    // const data = posts.find((post) => post.id == parent.postId);

    const data = await _db.Post.findById(parent.post);
    return data;
  },
  user: async (parent, args, { _db }) => {
    // const data = users.find((user) => user.id == parent.userId);

    const data = await _db.User.findById(parent.user);
    return data;
  },
};
