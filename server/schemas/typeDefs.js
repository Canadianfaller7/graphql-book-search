const { gql } = require('apollo-server-express');

const typeDefs = gql `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    authors: [String]
    bookId: ID
    description: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }
  
  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(
      authors: [String]
      bookId: ID!
      description: String
      image: String
      link: String
      title: String
      ): User 
      deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;


/* Future Query's to add */
    // users: [User]
    // user(username: String!): User
    // books: [Book]
    // book(bookId: ID!): Book