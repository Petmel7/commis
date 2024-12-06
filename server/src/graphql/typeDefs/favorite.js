const { gql } = require('apollo-server-express');

const favoriteTypeDefs = gql`

  type Favorite {
    id: ID!
    product_id: ID!
    product: Product!
  }

  type Product {
    id: ID!
    user_id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    images: [String]
    subcategory_id: ID
    is_active: Boolean
    is_blocked: Boolean
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
