import { comments, users } from "../../data.js";

export const Post = {
  user: (parent, args) => {
    const data = users.find((user) => user.id == parent.userId);

    return data;
  },
  comments: (parent, args) => {
    const data = comments.filter((comment) => comment.postId == parent.id);

    return data;
  },
};
