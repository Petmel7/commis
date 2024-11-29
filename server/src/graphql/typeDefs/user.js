const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    lastname: String
    email: String!
    emailconfirmed: Boolean!
    role: String!
    is_blocked: Boolean!
    createdat: String!
    status: String!
    last_login: String
  }

  type Query {
    users: [User!]!       # Отримати список користувачів
    user(id: ID!): User   # Отримати користувача за ID
  }

  type Mutation {
    registerUser(name: String!, lastname: String, email: String!, password: String!): String
    confirmEmail(token: String!): String
    addPhoneNumber(phone: String!, userId: Int!): String!
    confirmPhoneNumber(userId: Int!, confirmationcode: Int!): String
    loginUser(email: String!, password: String!): String
    logoutUser(token: String!): String
    getUserProfile(userId: Int!): UserProfile
    refreshToken(token: String!): String
  }

  type UserProfile {
    id: Int
    name: String
    lastname: String
    email: String
    emailConfirmed: Boolean
    phone: String
    phoneConfirmed: Boolean
    googleRegistered: Boolean
    role: String
    isBlocked: Boolean
}
`;
