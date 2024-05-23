// import { Mutation } from "./Mutation.js";
// import { Query } from "./Query.js";
// import { Subscription } from "./Subscription.js";
// import { User } from "./User.js";
// import { Comment } from "./Comment.js";
// import { Post } from "./Post.js";

// export default {
//   User,
//   Comment,
//   Post,
//   Mutation,
//   Query,
//   Subscription,
// };

import path from "path";
import { loadFiles } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";

import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadedResolvers = await loadFiles(path.join(__dirname, "*resolvers.js"), {
  extensions: ["js"],
  ignoreIndex: true,
  requireMethod: async (path) => {
    return await import(url.pathToFileURL(path));
  },
});
const resolvers = mergeResolvers(loadedResolvers);

export default resolvers;
