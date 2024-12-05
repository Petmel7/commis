const { gql } = require('apollo-server-express');

const productTypeDefs = gql`
  type Product {
    id: ID!
    user_id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    images: [String]
    subcategory_id: Int!
    is_active: Boolean!
    is_blocked: Boolean!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    getSellerProducts(userId: ID!): [Product]
  }

  type Mutation {
    addProduct(
      userId: ID!,
      name: String!,
      description: String!,
      price: Int!,
      stock: Int,
      category: String!,
      subcategory: String!,
      images: [String]
    ): Product!
    updateProduct(id: ID!, updateData: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    deleteImagesFromProduct(productId: ID!, indices: [Int!]!): Boolean!
    searchProducts(query: String!): [Product]!
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    stock: Int
    images: [String]
    is_active: Boolean
    is_blocked: Boolean
  }
`;

module.exports = productTypeDefs;
