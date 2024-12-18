const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    phone: String
    role: String
    is_blocked: Boolean
    created_at: String
    updated_at: String
  }

  type RoleInfo {
    title: String!
    slug: String!
    count: Int!
    users: [User!]!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    is_blocked: Boolean
    created_at: String
    updated_at: String
  }

  type Query {
    getUserRoleCounts: [RoleInfo!]!
    getUsersByRole(role: String!): [User!]!
  }

  type Mutation {
    deleteUser(userId: ID!): String!
    updateUser(
      userId: ID!
      name: String
      email: String
      phone: String
      role: String
    ): User!
    blockUser(userId: ID!, isBlocked: Boolean!): User!
    blockProduct(productId: ID!, isBlocked: Boolean!): Product!
  }
`;

module.exports = userTypeDefs;
