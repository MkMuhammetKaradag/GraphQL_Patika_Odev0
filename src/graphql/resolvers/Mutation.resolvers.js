import { comments, posts, users } from "../../data.js";

import { nanoid } from "nanoid";
export const Mutation = {
  // incrementGlobalCounter: (parent, args, context) => {
  //   globalCounter++;
  //   context.pubSub.publish("globalCounter:changed");
  //   return globalCounter;
  // },

  createUser: (parent, args, context) => {
    const user = {
      id: nanoid(),
      ...args.data,
    };
    try {
      users.push(user);
    } catch (error) {
      throw error;
    }
    context.pubSub.publish("userCreated", user);

    return user;
  },

  updateUser: (parent, args, context) => {
    const user_index = users.findIndex((user) => user.id == args.id);
    if (user_index == -1) {
      throw new Error("user not found");
    }
    users[user_index] = { ...users[user_index], ...args.data };
    context.pubSub.publish("updateUser", users[user_index]);
    return users[user_index];
  },

  deleteUser: (parent, args, context) => {
    const user_index = users.findIndex((user) => user.id == args.id);
    if (user_index == -1) {
      throw new Error("user not found");
    }
    const delete_user = users[user_index];

    users.splice(user_index, 1);
    context.pubSub.publish("deleteUser", delete_user);

    return delete_user;
  },

  deleteAllUsers: () => {
    const length = users.length;
    users.splice(0, length);

    return {
      count: length,
    };
  },
  createPost: (parent, args, context) => {
    const post = {
      id: nanoid(),
      ...args.data,
    };
    try {
      posts.unshift(post);
    } catch (error) {
      throw error;
    }
    context.pubSub.publish("createPost", post);
    context.pubSub.publish("countPost", posts.length);
    return post;
  },

  updatePost: (parent, args, context) => {
    const post_index = posts.findIndex((post) => post.id == args.id);
    if (post_index == -1) {
      throw new Error("post not found");
    }
    posts[post_index] = { ...posts[post_index], ...args.data };
    context.pubSub.publish("updatePost", posts[post_index]);

    return posts[post_index];
  },

  deletePost: (parent, args, context) => {
    const post_index = posts.findIndex((post) => post.id == args.id);
    if (post_index == -1) {
      throw new Error("post not found");
    }
    const delete_post = posts[post_index];
    posts.splice(post_index, 1);
    context.pubSub.publish("deletePost", delete_post);
    context.pubSub.publish("countPost", posts.length);

    return delete_post;
  },
  deleteAllPosts: (_, _args, context) => {
    const length = posts.length;
    posts.splice(0, length);
    context.pubSub.publish("countPost", posts.length);
    return {
      count: length,
    };
  },
  createComment: (parent, args, context) => {
    const comment = {
      id: nanoid(),
      ...args.data,
    };
    try {
      comments.push(comment);
    } catch (error) {
      throw error;
    }
    context.pubSub.publish("createComment", comment);

    return comment;
  },
  updateComment: (parent, args, context) => {
    const comment_index = comments.findIndex(
      (comment) => comment.id == args.id
    );
    if (comment_index == -1) {
      throw new Error("comment not found");
    }
    comments[comment_index] = { ...comments[comment_index], ...args.data };
    context.pubSub.publish("updateComment", comments[comment_index]);

    return comments[comment_index];
  },
  deleteComment: (parent, args, context) => {
    const comment_index = comments.findIndex(
      (comment) => comment.id == args.id
    );
    if (comment_index == -1) {
      throw new Error("comment_index not found");
    }
    const delete_comment = comments[comment_index];
    comments.splice(comment_index, 1);
    context.pubSub.publish("deleteComment", delete_comment);

    return delete_comment;
  },
  deleteAllComments: () => {
    const length = comments.length;
    comments.splice(0, length);

    return {
      count: length,
    };
  },
};
