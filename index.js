import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { events, locations, participants, users } from "./data.js";

const typeDefs = `#graphql


type User {
    id:Int!
    username:String!
    email:String!
    events:[Event!]!
}

type Event {
  id:Int!
  title:String!
  desc:String!
  date:String!
  from:String!
  to:String!
  location_id:Int!
  user_id:Int!
  user:User!
  location:Location!
  participants:[Participant!]
}
type Location {
    id:Int!
    name:String!
    desc:String!
    lat:Float!
    lng:Float!
   
}

type Participant {
    id:Int!
    user_id:Int!
    event_id:Int!
    event:Event!
    username:String!
    user:User!
   
}
  type Query { 
    users:[User!]
    user(id:Int):User

    events:[Event!]
    event(id:Int):Event
    
    
    location(id:Int):Location
    locations:[Location!]

    participant(id:Int):Participant
    participants:[Participant!]

    
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
