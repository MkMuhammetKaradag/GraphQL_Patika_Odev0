import { comments, users } from "../../data.js";

export const Post = {
  user: async (parent, args, { _db }) => {
    // const data = users.find((user) => user.id == parent.userId);
    // console.log(parent.user);
    const data = await _db.User.findById(parent.user);
    // console.log("data", data);
    return data;
  },
  comments: async (parent, args, { _db }) => {
    // const data = comments.filter((comment) => comment.postId == parent.id);
    const data = await _db.Comment.find({ post: parent._id });
    // console.log(data);
    return data;

    return data;
  },
};
