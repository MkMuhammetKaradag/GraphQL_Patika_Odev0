import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { events, locations, participants, users } from "./data.js";
import { nanoid } from "nanoid";
import { createServer } from "node:http";
import { createSchema, createYoga, filter, pipe } from "graphql-yoga";
import pubSub from "./pubsub.js";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import db from "./db.js";
import User from "./models/User.js";
import Event from "./models/Event.js";
import Location from "./models/Location.js";
import Participant from "./models/Participant.js";
db();
const typeDefs = /* GraphQL */ `
  type User {
    _id: ID!
    username: String!
    email: String!
    events: [Event!]
  }
  input CreateUserInput {
    username: String!
    email: String!
  }
  input UpdateUserInput {
    username: String
    email: String
  }

  type Event {
    _id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    user: User!
    location: Location!
    participants: [Participant!]
  }
  input CreateEventInput {
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location: ID!
    user: ID!
  }
  input UpdateEventInput {
    title: String
    desc: String
    date: String
    from: String
    to: String
    location: ID
    user: ID
  }

  type Location {
    _id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  input CreateLocationInput {
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  input UpdateLocationInput {
    name: String
    desc: String
    lat: Float
    lng: Float
  }

  type Participant {
    _id: ID!
    event: Event!
    username: String!
    user: User!
  }

  input CreateParticipantInput {
    user: ID!
    event: ID!
  }
  input UpdateParticipantInput {
    user: ID
    event: ID
  }

  type Query {
    users: [User!]
    user(id: ID): User

    events: [Event!]
    event(id: ID): Event

    location(id: ID): Location
    locations: [Location!]

    participant(id: ID): Participant
    participants: [Participant!]
  }
  type DeleteAllOutput {
    count: Int!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!

    createEvent(data: CreateEventInput!): Event!
    updateEvent(id: ID!, data: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvents: DeleteAllOutput!

    createLocation(data: CreateLocationInput!): Location!
    updateLocation(id: ID!, data: UpdateLocationInput!): Location!
    deleteLocation(id: ID!): Location!
    deleteAllLocations: DeleteAllOutput!

    createParticipant(data: CreateParticipantInput!): Participant!
    updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!
    deleteParticipant(id: ID!): Participant!
    deleteAllParticipants: DeleteAllOutput!
  }

  type Subscription {
    createUser: User
    createEvent: Event
    createLocation: Location
    createParticipant(event: ID): Participant
  }
`;
const resolvers = {
  Query: {
    users: async (_, __, context) => {
      const users = await context.db.User.find();
      return users;
    },
    user: async (parent, args, context) => {
      const user = await context.db.User.findById(args.id);

      if (!user) {
        throw "user not found";
      }

      return user;
    },

    events: async (_, __, context) => {
      const events = await context.db.Event.find();
      return events;
    },
    event: async (parent, args, context) => {
      const event = await context.db.Event.findById(args.id);
      if (!event) {
        throw "event  not found";
      }

      return event;
    },

    locations: async (_, __, context) => {
      const locations = await context.db.Location.find();
      return locations;
    },
    location: async (parent, args, context) => {
      const location = await context.db.Location.findById(args.id);

      if (!location) {
        throw "location  not found";
      }

      return location;
    },

    participants: async (_, __, context) => {
      const participant = await context.db.Participant.find();
      return participant;
    },
    participant: async (parent, args, context) => {
      const participant = await context.db.Participant.findById(args.id);

      if (!participant) {
        throw "participant  not found";
      }

      return participant;
    },
  },

  Mutation: {
    createUser: async (parent, args, context) => {
      const newUser = new context.db.User({
        ...args.data,
      });
      const user = await newUser.save();

      context.pubSub.publish("createUser", user);
      return user;
    },
    updateUser: async (parent, args, context) => {
      try {
        const is_user_exist = context.db.User.findById(args.id);
        if (!is_user_exist) {
          throw new Error("user not found");
        }
        const update_user = await context.db.User.findByIdAndUpdate(
          args.id,
          args.data,
          { new: true }
        );
        return update_user;
      } catch (error) {
        console.log(error);
      }
    },

    deleteUser: async (parent, args, context) => {
      try {
        const is_user_exist = context.db.User.findById(args.id);
        if (!is_user_exist) {
          throw new Error("user not found");
        }
        const delete_user = await context.db.User.findByIdAndDelete(args.id);
        return delete_user;
      } catch (error) {
        console.log(error);
      }
    },

    createEvent: async (parent, args, context) => {
      const newEvent = new context.db.Event({
        ...args.data,
      });
      const event = await newEvent.save();
      const user = await context.db.User.findById(args.data.user);
      user.events.push(event.id);

      user.save();

      context.pubSub.publish("createEvent", event);
      return event;
    },
    updateEvent: async (parent, args, context) => {
      try {
        const is_post_exist = context.db.Event.findById(args.id);
        if (!is_post_exist) {
          throw new Error("Event not found");
        }
        const update_event = await context.db.Event.findByIdAndUpdate(
          args.id,
          args.data,
          { new: true }
        );
        return update_event;
      } catch (error) {
        console.log(error);
      }
    },

    deleteEvent: async (parent, args, context) => {
      try {
        const is_Event_exist = context.db.Event.findById(args.id);
        if (!is_Event_exist) {
          throw new Error("Event not found");
        }
        const delete_event = await context.db.Event.findByIdAndDelete(args.id);
        return delete_event;
      } catch (error) {
        console.log(error);
      }
    },

    deleteAllEvents: async (_, __, context) => {
      const delete_events = await context.db.Event.deleteMany({});

      return {
        count: delete_events.deletedCount,
      };
    },

    createLocation: async (parent, args, context) => {
      const newLocation = new context.db.Location({
        ...args.data,
      });
      const location = await newLocation.save();
      // const user = await context.db.User.findById(args.data.user);
      // user.events.push(event.id);

      // user.save();

      context.pubSub.publish("createLocation", location);

      return location;
    },
    updateLocation: async (parent, args, context) => {
      try {
        const is_location_exist = context.db.Location.findById(args.id);
        if (!is_location_exist) {
          throw new Error("Location not found");
        }
        const update_location = await context.db.Location.findByIdAndUpdate(
          args.id,
          args.data,
          { new: true }
        );
        return update_location;
      } catch (error) {
        console.log(error);
      }
    },

    deleteLocation: async (parent, args, context) => {
      try {
        const is_location_exist = context.db.Location.findById(args.id);
        if (!is_location_exist) {
          throw new Error("Location not found");
        }
        const delete_location = await context.db.Location.findByIdAndDelete(
          args.id
        );
        return delete_location;
      } catch (error) {
        console.log(error);
      }
    },

    deleteAllLocations: async (_, __, context) => {
      const delete_locations = await context.db.Location.deleteMany({});

      return {
        count: delete_locations.deletedCount,
      };
    },

    createParticipant: async (parent, args, context) => {
      const newParticipant = new context.db.Participant({
        ...args.data,
      });
      const participant = await newParticipant.save();
      context.pubSub.publish("createParticipant", participant);

      return participant;
    },
    updateParticipant: async (parent, args, context) => {
      try {
        const is_participant_exist = context.db.Participant.findById(args.id);
        if (!is_participant_exist) {
          throw new Error("Participant not found");
        }
        const update_participant =
          await context.db.Participant.findByIdAndUpdate(args.id, args.data, {
            new: true,
          });
        return update_participant;
      } catch (error) {
        console.log(error);
      }
    },

    deleteParticipant: async (parent, args, context) => {
      try {
        const is_participant_exist = context.db.Participant.findById(args.id);
        if (!is_participant_exist) {
          throw new Error("Participant not found");
        }
        const delete_participant =
          await context.db.Participant.findByIdAndDelete(args.id);
        return delete_participant;
      } catch (error) {
        console.log(error);
      }
    },

    deleteAllParticipants: async (_, __, context) => {
      const delete_participants = await context.db.Participant.deleteMany({});

      return {
        count: delete_participants.deletedCount,
      };
    },
  },
  Subscription: {
    createUser: {
      subscribe: (_, _args, context) => {
        return context.pubSub.asyncIterator("createUser");
      },
      resolve: (payload) => payload,
    },
    createEvent: {
      subscribe: (_, _args, context) => {
        return context.pubSub.asyncIterator("createEvent");
      },
      resolve: (payload) => payload,
    },
    createLocation: {
      subscribe: (_, _args, context) => {
        return context.pubSub.asyncIterator("createLocation");
      },
      resolve: (payload) => payload,
    },
    createParticipant: {
      subscribe: (_, args, context) =>
        pipe(
          context.pubSub.asyncIterator("createParticipant"),
          filter((participant) => {
            // console.log("args", args);
            return args.event ? participant.event == args.event : true;
          })
        ),

      resolve: (payload) => payload,
    },
  },
  User: {
    events: async (parent, args, context) => {
      const data = await context.db.Event.find({ user: parent._id });

      return data;
    },
  },
  Event: {
    user: async (parent, args, context) => {
      const data = await context.db.User.findById(parent.user);

      return data;
    },
    location: async (parent, args, context) => {
      const data = await context.db.Location.findById(parent.location);

      return data;
    },
    participants: async (parent, args, context) => {
      const data = await context.db.Participant.find({ event: parent._id });

      return data;
    },
  },

  Participant: {
    user: async (parent, args, context) => {
      const data = await context.db.User.findById(parent.user);

      return data;
    },

    username: async (parent, args, context) => {
      const data = await context.db.User.findById(parent.user);

      return data.username;
    },
    event: async (parent, args, context) => {
      const data = await context.db.Event.findById(parent.event);

      return data;
    },
  },
};

const yogaApp = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: { pubSub, db: { User, Event, Location, Participant } },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})], // not working
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
