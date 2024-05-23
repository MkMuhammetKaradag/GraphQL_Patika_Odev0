import { posts, users } from "../../data.js";

export const Comment = {
  post: (parent, args) => {
    const data = posts.find((post) => post.id == parent.postId);

    return data;
  },
  user: (parent, args) => {
    const data = users.find((user) => user.id == parent.userId);

    return data;
  },
};
