const { gql } = require('apollo-server-express');

const catalogTypeDefs = gql`

type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    images: [String]
    is_active: Boolean
    is_blocked: Boolean
    created_at: String
    updated_at: String
    subcategory: Subcategory
}

type Subcategory {
    id: ID!
    name: String!
}
  type Query {
    getProductsByCategory(category: String!): [Product!]!
  }
`;

module.exports = catalogTypeDefs;