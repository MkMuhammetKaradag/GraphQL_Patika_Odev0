import { comments, posts } from "../../data.js";

export const User = {
  posts: async (parent, args, { _db }) => {
    // const data = posts.filter((post) => post.userId == parent.id);

    const data = await _db.Post.find({ user: parent._id });

    return data;
  },
  comments: async (parent, args, { _db }) => {
    // const data = comments.filter((comment) => comment.userId == parent.id);
    // console.log("hello");
    const data = await _db.Comment.find({ user: parent._id });
    // console.log(data);
    return data;
  },
};
