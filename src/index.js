import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import pubSub from "./pubsub.js";
import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
// import { typeDefs } from "./graphql/schemaGraphql.js";
import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/types/index.js";
import { WebSocketServer } from "ws";

import { useServer } from "graphql-ws/lib/use/ws";
// console.log("test", resolvers);

import db from "./db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
db();
// setTimeout(async () => {
//   const post = await Comment.find();
//   console.log(post);
// }, 2000);
const yogaApp = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
  }),
  context: { pubSub, _db: { User, Post, Comment } },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
  graphiql: {
    subscriptionsProtocol: "WS",
  },
});

const httpServer = createServer(yogaApp);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: yogaApp.graphqlEndpoint,
});

useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer
);
httpServer.listen(4000, () => {
  console.log("Server is running on port 4000");
});
