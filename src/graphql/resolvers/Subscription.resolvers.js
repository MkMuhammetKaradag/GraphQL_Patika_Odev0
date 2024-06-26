import { filter, map, pipe } from "graphql-yoga";
import { posts } from "../../data.js";

export const Subscription = {
  // userCreated: {
  //   subscribe: () =>
  //     new Repeater((push, stop) => {
  //       let counter = 0;
  //       function increment() {
  //         push(counter++);
  //         console.log("push");
  //       }
  //       increment();
  //       const interval = setInterval(increment, 1000);
  //       stop.then(() => {
  //         clearInterval(interval);
  //         console.log("stop");
  //       });
  //     }),
  //   resolve: (payload) => payload,
  // },
  userCreated: {
    subscribe: (_, _args, context) => {
      // const as = context.pubSub.subscribe("userCreated");
      // const df = context.pubSub.asyncIterator("userCreated");
      // console.log(as, df);
      return context.pubSub.asyncIterator("userCreated");
    },
    resolve: (payload) => payload,
  },
  updateUser: {
    subscribe: (_, _args, context) =>
      context.pubSub.asyncIterator("updateUser"),
    resolve: (payload) => payload,
  },
  deleteUser: {
    subscribe: (_, _args, context) =>
      context.pubSub.asyncIterator("deleteUser"),
    resolve: (payload) => payload,
  },
  createPost: {
    subscribe: (_, args, context) =>
      pipe(
        context.pubSub.asyncIterator("createPost"),
        filter((post) => {
          // console.log("post", "dinledim seni ");
          return args.userId ? post.user == args.userId : true;
        })
      ),
    resolve: (payload) => {
      // console.log("payload:", payload);
      return payload;
    },
  },
  updatePost: {
    subscribe: (_, args, context) => context.pubSub.asyncIterator("updatePost"),
    resolve: (payload) => payload,
  },
  deletePost: {
    subscribe: (_, _args, context) =>
      context.pubSub.asyncIterator("deletePost"),
    resolve: (payload) => payload,
  },

  countPost: {
    subscribe: async (_, _args, context) => {
      const post_count = await context._db.Post.countDocuments();
      setTimeout(() => {
        context.pubSub.publish("countPost", post_count);
      }, 100);
      return context.pubSub.asyncIterator("countPost");
    },
    resolve: (payload) => payload,
  },
  createComment: {
    subscribe: (_, args, context) =>
      pipe(
        context.pubSub.asyncIterator("createComment"),
        filter((comment) => {
          return args.postId ? comment.post == args.postId : true;
        })
      ),
    resolve: (payload) => payload,
  },
  updateComment: {
    subscribe: (_, _args, context) =>
      context.pubSub.asyncIterator("updateComment"),
    resolve: (payload) => payload,
  },
  deleteComment: {
    subscribe: (_, _args, context) =>
      context.pubSub.asyncIterator("deleteComment"),
    resolve: (payload) => payload,
  },
  // globalCounter: {
  //   // Merge initial value with source stream of new values
  //   subscribe: (_, _args, context) =>
  //     pipe(
  //       Repeater.merge([
  //         // cause an initial event so the globalCounter is streamed to the client
  //         // upon initiating the subscription
  //         undefined,
  //         // event stream for future updates
  //         context.pubSub.subscribe("globalCounter:changed"),
  //       ]),
  //       // map all events to the latest globalCounter
  //       map(() => globalCounter)
  //     ),
  //   resolve: (payload) => payload,
  // },
};
