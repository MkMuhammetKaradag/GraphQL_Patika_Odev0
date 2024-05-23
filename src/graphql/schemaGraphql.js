export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    fullName: String!
    age: Int!
    posts: [Post!]
    comments: [Comment!]!
  }

  input CreateUserInput {
    fullName: String!
    age: Int!
  }
  input UpdateUserInput {
    fullName: String
    age: Int
  }

  type Comment {
    id: ID!
    text: String!
    postId: ID!
    userId: ID!
    post: Post
    user: User
  }
  input CreateCommentInput {
    text: String!
    postId: ID!
    userId: ID!
  }

  input UpdateCommentInput {
    text: String
    postId: ID
    userId: ID
  }

  type Post {
    id: ID!
    title: String!
    userId: ID!
    comments: [Comment!]
    user: User
  }
  input CreatePostInput {
    title: String!
    userId: ID
  }
  input UpdatePostInput {
    title: String
    userId: ID
  }

  type Query {
    user(id: ID): User
    users: [User]

    posts: [Post]
    post(id: ID): Post

    comments: [Comment]
    comment(id: ID): Comment
  }

  type DeleteAllOutput {
    count: Int!
  }

  type Mutation {
    incrementGlobalCounter: Int!
    test: Int!

    createUser(data: CreateUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!

    createPost(data: CreatePostInput!): Post!
    updatePost(id: ID!, data: UpdatePostInput): Post!
    deletePost(id: ID!): Post!
    deleteAllPosts: DeleteAllOutput!

    createComment(data: CreateCommentInput!): Comment
    updateComment(id: ID!, data: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
    deleteAllComments: DeleteAllOutput!
  }

  type Subscription {
    userCreated: User!
    updateUser: User!
    deleteUser: User!

    createPost(userId: ID): Post!
    updatePost: Post!
    deletePost: Post!
    countPost: Int!

    createComment(postId: ID): Comment!
    updateComment: Comment!
    deleteComment: Comment!

    globalCounter: Int!
  }
`;
