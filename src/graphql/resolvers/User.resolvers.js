import { comments, posts } from "../../data.js";

export const User = {
  posts: (parent, args) => {
    const data = posts.filter((post) => post.userId == parent.id);

    return data;
  },
  comments: (parent, args) => {
    const data = comments.filter((comment) => comment.userId == parent.id);

    return data;
  },
};
