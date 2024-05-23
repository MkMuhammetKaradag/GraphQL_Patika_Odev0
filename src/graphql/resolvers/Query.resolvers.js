import { comments, posts, users } from "../../data.js";

export const Query = {
  users: () => users,
  user: (parent, args) => {
    const data = users.find((user) => user.id == args.id);
    if (!data) {
      throw "user not found";
    }

    return data;
  },
  posts: () => posts,
  post: (parent, args) => {
    const data = posts.find((post) => post.id == args.id);
    if (!data) {
      throw "post not found";
    }

    return data;
  },
  comments: () => comments,
  comment: (parent, args) => {
    const data = comments.find((comment) => comment.id == args.id);
    if (!data) {
      throw "comment not found";
    }

    return data;
  },
};
