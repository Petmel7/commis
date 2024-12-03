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

type UserSummary {
    id: ID!
    name: String!
    email: String!
}

type LoginResponse {
    accessToken: String!
    refreshToken: String!
    user: UserSummary! # Вказує на спрощений тип User
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

  type Query {
    users: [User!]!       # Отримати список користувачів
    user(id: ID!): User   # Отримати користувача за ID
  }

  type Mutation {
    registerUser(name: String!, lastname: String, email: String!, password: String!): String
    confirmEmail(token: String!): String
    addPhoneNumber(phone: String!, userId: ID!): String
    confirmPhoneNumber(userId: ID!, confirmationcode: String!): String
    loginUser(email: String!, password: String!): LoginResponse!
    logoutUser(token: String!): String
    getUserProfile(userId: ID!): UserProfile
    refreshToken(token: String!): String
  }
`;
