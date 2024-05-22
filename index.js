import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { events, locations, participants, users } from "./data.js";
import { nanoid } from "nanoid";
import { createServer } from "node:http";
import {
  Repeater,
  createPubSub,
  createSchema,
  createYoga,
  filter,
  map,
  pipe,
} from "graphql-yoga";

import pubSub from "./pubsub.js";
const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
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
    id: ID!
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
    location_id: ID!
    user_id: ID!
  }
  input UpdateEventInput {
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
  }

  type Location {
    id: ID!
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
    id: ID!
    user_id: ID!
    event_id: ID!
    event: Event!
    username: String!
    user: User!
  }

  input CreateParticipantInput {
    user_id: ID!
    event_id: ID!
  }
  input UpdateParticipantInput {
    user_id: ID
    event_id: ID
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
    createParticipant: Participant
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => {
      const data = users.find((user) => user.id == args.id);
      if (!data) {
        throw "user not found";
      }

      return data;
    },

    events: () => events,
    event: (parent, args) => {
      const data = events.find((event) => event.id == args.id);
      if (!data) {
        throw "event  not found";
      }

      return data;
    },

    locations: () => locations,
    location: (parent, args) => {
      const data = locations.find((location) => location.id == args.id);
      if (!data) {
        throw "location  not found";
      }

      return data;
    },

    participants: () => participants,
    participant: (parent, args) => {
      const data = participants.find(
        (participant) => participant.id == args.id
      );
      if (!data) {
        throw "participant  not found";
      }

      return data;
    },
  },

  Mutation: {
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
      context.pubSub.publish("createUser", user);
      return user;
    },
    updateUser: (parent, args) => {
      const user_index = users.findIndex((user) => user.id == args.id);
      if (user_index == -1) {
        throw new Error("user not found");
      }
      users[user_index] = { ...users[user_index], ...args.data };
      return users[user_index];
    },

    deleteUser: (parent, args) => {
      const user_index = users.findIndex((user) => user.id == args.id);
      if (user_index == -1) {
        throw new Error("user not found");
      }
      const delete_user = users[user_index];
      users.splice(user_index, 1);
      return delete_user;
    },

    deleteAllUsers: () => {
      const length = users.length;
      users.splice(0, length);

      return {
        count: length,
      };
    },

    createEvent: (parent, args, context) => {
      const event = {
        id: nanoid(),
        ...args.data,
      };
      try {
        events.push(event);
      } catch (error) {
        throw error;
      }
      context.pubSub.publish("createEvent", event);
      return event;
    },
    updateEvent: (parent, args) => {
      const event_index = events.findIndex((event) => event.id == args.id);
      if (event_index == -1) {
        throw new Error("event not found");
      }
      events[event_index] = { ...events[event_index], ...args.data };
      return events[event_index];
    },

    deleteEvent: (parent, args) => {
      const event_index = events.findIndex((event) => event.id == args.id);
      if (event_index == -1) {
        throw new Error("event not found");
      }

      const delete_event = events[event_index];
      events.splice(event_index, 1);
      return delete_event;
    },

    deleteAllEvents: () => {
      const length = events.length;
      events.splice(0, length);

      return {
        count: length,
      };
    },

    createLocation: (parent, args, context) => {
      const location = {
        id: nanoid(),
        ...args.data,
      };
      try {
        locations.push(location);
      } catch (error) {
        throw error;
      }
      context.pubSub.publish("createLocation", location);

      return location;
    },
    updateLocation: (parent, args) => {
      const location_index = locations.findIndex(
        (location) => location.id == args.id
      );
      if (location_index == -1) {
        throw new Error("location not found");
      }
      locations[location_index] = {
        ...locations[location_index],
        ...args.data,
      };
      return locations[location_index];
    },

    deleteLocation: (parent, args) => {
      const location_index = locations.findIndex(
        (location) => location.id == args.id
      );
      if (location_index == -1) {
        throw new Error("location not found");
      }

      const delete_location = locations[location_index];
      locations.splice(location_index, 1);
      return delete_location;
    },

    deleteAllLocations: () => {
      const length = locations.length;
      locations.splice(0, length);

      return {
        count: length,
      };
    },

    createParticipant: (parent, args, context) => {
      const participant = {
        id: nanoid(),
        ...args.data,
      };
      try {
        participants.push(participant);
      } catch (error) {
        throw error;
      }
      context.pubSub.publish("createParticipant", participant);

      return participant;
    },
    updateParticipant: (parent, args) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id == args.id
      );
      if (participant_index == -1) {
        throw new Error("participant not found");
      }
      participants[participant_index] = {
        ...participants[participant_index],
        ...args.data,
      };
      return participants[participant_index];
    },

    deleteParticipant: (parent, args) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id == args.id
      );
      if (participant_index == -1) {
        throw new Error("participant not found");
      }

      const delete_participant = participants[participant_index];
      participants.splice(participant_index, 1);
      return delete_participant;
    },

    deleteAllParticipants: () => {
      const length = participants.length;
      participants.splice(0, length);

      return {
        count: length,
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
      subscribe: (_, _args, context) => {
        return context.pubSub.asyncIterator("createParticipant");
      },
      resolve: (payload) => payload,
    },
  },
  User: {
    events: (parent, args) => {
      const data = events.filter((event) => event.user_id == parent.id);

      return data;
    },
  },
  Event: {
    user: (parent, args) => {
      const data = users.find((user) => user.id == parent.user_id);

      return data;
    },
    location: (parent, args) => {
      const data = locations.find(
        (location) => location.id == parent.location_id
      );

      return data;
    },
    participants: (parent, args) => {
      const data = participants.filter(
        (participant) => participant.event_id == parent.id
      );

      return data;
    },
  },

  Participant: {
    user: (parent, args) => {
      const data = users.find((user) => user.id == parent.user_id);

      return data;
    },

    username: (parent, args) => {
      const data = users.find((user) => user.id == parent.user_id);

      return data.username;
    },
    event: (parent, args) => {
      const data = events.find((event) => event.id == parent.event_id);

      return data;
    },
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: { pubSub },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})], // not working
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
