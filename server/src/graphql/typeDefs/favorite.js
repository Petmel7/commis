const { gql } = require('apollo-server-express');

const favoriteTypeDefs = gql`

  type Favorite {
    id: ID!
    product_id: ID!
    product: Product!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    images: [String]
    user_id: ID!
  }

  type Query {
    getFavorites: [Favorite!]!
  }

  type Mutation {
    addFavorite(productId: ID!): String!
    deleteFavorite(id: ID!): String!
  }
`;

module.exports = favoriteTypeDefs;
