import { comments, posts, users } from "../../data.js";

export const Query = {
  users: async (_, _args, { _db }) => {
    const users = await _db.User.find();
    return users;
  },
  user: async (parent, args, { _db }) => {
    const user = await _db.User.findById(args.id);

    // const data = users.find((user) => user.id == args.id);
    // console.log("hello");
    if (!user) {
      throw "user not found";
    }

    return user;
  },
  posts: async (_, _args, { _db }) => {
    const posts = await _db.Post.find().sort({ _id: -1 });
    return posts;
  },
  post: async (parent, args, { _db }) => {
    const post = await _db.Post.findById(args.id);

    // const data = posts.find((post) => post.id == args.id);
    if (!post) {
      throw "post not found";
    }

    return post;
  },
  comments: async (_, _args, { _db }) => {
    const comments = await _db.Comment.find();
    return comments;
  },
  comment: async (parent, args, { _db }) => {
    // const data = comments.find((comment) => comment.id == args.id);
    const comment = await _db.Comment.findById(args.id);

    if (!comment) {
      throw "comment not found";
    }

    return comment;
  },
};
