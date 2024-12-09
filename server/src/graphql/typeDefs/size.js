
const { gql } = require('apollo-server-express');

const sizeTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    sizes: [Size!]!
}

  type Size {
    id: ID!
    size: String!
}
    type Query {
    getSizesByProductId(productId: ID!): [Size!]!
}

  type Mutation {
    addSizeToProduct(productId: ID!, sizes: [String!]!): Boolean!
    removeSizeFromProduct(productId: ID!, sizeId: ID!): Boolean!
}
`;

module.exports = sizeTypeDefs;
