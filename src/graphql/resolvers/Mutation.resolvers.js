import mongoose from "mongoose";
import { comments, posts, users } from "../../data.js";

import { nanoid } from "nanoid";
export const Mutation = {
  // incrementGlobalCounter: (parent, args, context) => {
  //   globalCounter++;
  //   context.pubSub.publish("globalCounter:changed");
  //   return globalCounter;
  // },

  createUser: async (parent, args, context) => {
    const newUser = new context._db.User({
      ...args.data,
    });
    const user = await newUser.save();
    try {
      // users.push(user);
    } catch (error) {
      throw error;
    }
    context.pubSub.publish("userCreated", user);

    return user;
  },

  updateUser: async (parent, args, context) => {
    // const user_index = users.findIndex((user) => user.id == args.id);
    try {
      const is_user_exist = context._db.User.findById(args.id);
      if (!is_user_exist) {
        throw new Error("user not found");
      }
      const update_user = await context._db.User.findByIdAndUpdate(
        args.id,
        args.data,
        { new: true }
      );
      context.pubSub.publish("updateUser", update_user);
      return update_user;
    } catch (error) {
      console.log(error);
    }
  },

  deleteUser: async (parent, args, context) => {
    try {
      const is_user_exist = context._db.User.findById(args.id);
      if (!is_user_exist) {
        throw new Error("user not found");
      }
      const delete_user = await context._db.User.findByIdAndDelete(args.id);
      context.pubSub.publish("deleteUser", delete_user);
      return delete_user;
    } catch (error) {
      console.log(error);
    }
  },

  deleteAllUsers: async (_, __, context) => {
    const delete_users = await context._db.User.deleteMany({});

    return {
      count: delete_users.deletedCount,
    };
  },
  createPost: async (parent, args, context) => {
    const newPost = new context._db.Post({
      ...args.data,
    });
    const post = await newPost.save();
    const user = await context._db.User.findById(
      new mongoose.Types.ObjectId(args.data.user)
    );
    user.posts.push(post.id);

    user.save();
    const post_count = await context._db.Post.countDocuments();

    context.pubSub.publish("createPost", post);
    context.pubSub.publish("countPost", post_count);
    return post;
  },

  updatePost: async (parent, args, context) => {
    try {
      const is_post_exist = context._db.Post.findById(args.id);
      if (!is_post_exist) {
        throw new Error("post not found");
      }
      const update_post = await context._db.Post.findByIdAndUpdate(
        args.id,
        args.data,
        { new: true }
      );
      context.pubSub.publish("updatePost", update_post);

      return update_post;
    } catch (error) {
      console.log(error);
    }
  },

  deletePost: async (parent, args, context) => {
    try {
      const is_post_exist = await context._db.Post.findById(args.id);
      if (!is_post_exist) {
        throw new Error("post not found");
      }
      const delete_post = await context._db.Post.findByIdAndDelete(args.id);
      const post_count = await context._db.Post.countDocuments();
      // const user = await context._db.User.findById(
      //   new mongoose.Types.ObjectId(args.data.user)
      // );
      // user.posts.push(post.id);

      // user.save();

      context.pubSub.publish("deletePost", delete_post);
      context.pubSub.publish("countPost", post_count);

      return delete_post;
    } catch (error) {
      console.log(error);
    }
  },
  deleteAllPosts: async (_, _args, context) => {
    const delete_posts = await context._db.Post.deleteMany({});
    context.pubSub.publish("countPost", 0);
    return {
      count: delete_posts.deletedCount,
    };
  },
  createComment: async (parent, args, context) => {
    const newComment = new context._db.Comment({
      ...args.data,
    });
    const comment = await newComment.save();
    const post = await context._db.Post.findById(args.data.post);
    const user = await context._db.User.findById(args.data.user);

    user.comments.push(comment.id);

    post.comments.push(comment.id);

    await user.save();
    await post.save();

    context.pubSub.publish("createComment", comment);

    return comment;
  },
  updateComment: async (parent, args, context) => {
    try {
      const is_comment_exist = await context._db.Comment.findById(args.id);
      if (!is_comment_exist) {
        throw new Error("comment not found");
      }
      const update_comment = await context._db.Comment.findByIdAndUpdate(
        args.id,
        args.data,
        { new: true }
      );
      context.pubSub.publish("updateComment", update_comment);

      return update_comment;
    } catch (error) {
      console.log(error);
    }
  },
  deleteComment: async (parent, args, context) => {
    try {
      const is_comment_exist = await context._db.Comment.findById(args.id);
      if (!is_comment_exist) {
        throw new Error("post not found");
      }
      const delete_comment = await context._db.Comment.findByIdAndDelete(
        args.id
      );

      context.pubSub.publish("deleteComment", delete_comment);

      return delete_comment;
    } catch (error) {
      console.log(error);
    }
  },
  deleteAllComments: async (_, __, context) => {
    const delete_comment = await context._db.Comment.deleteMany({});

    return {
      count: delete_comment.deletedCount,
    };
  },
};
