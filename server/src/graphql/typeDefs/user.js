const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {
    id: ID
    name: String
    last_name: String
    email: String
    email_confirmed: Boolean
    role: String
    is_blocked: Boolean
    created_at: String
    updated_at: String
    status: String
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
    user: UserSummary!
}

  type UserProfile {
    id: Int
    name: String
    last_name: String
    email: String
    emailConfirmed: Boolean
    phone: String
    phoneConfirmed: Boolean
    googleRegistered: Boolean
    role: String
    isBlocked: Boolean
}

type TokenPair {
    newAccessToken: String!
    newRefreshToken: String!
}

  type Query {
    users: [User!]!
    user(id: ID!): User
    getUserProfile(userId: ID!): UserProfile
  }

  type Mutation {
    registerUser(name: String!, last_name: String, email: String!, password: String!): String
    confirmEmail(token: String!): String
    addPhoneNumber(phone: String!, userId: ID!): String
    confirmPhoneNumber(userId: ID!, confirmation_code: String!): String
    loginUser(email: String!, password: String!): LoginResponse!
    logoutUser(token: String!): String
    refreshToken(token: String!): TokenPair!
  }
`;

module.exports = userTypeDefs;
