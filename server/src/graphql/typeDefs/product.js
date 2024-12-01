const { gql } = require('apollo-server-express');

module.exports = gql`
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
  }

  type Mutation {
    getUserProducts(userId: ID!): [Product]
    addProduct(
        userId: ID!,
        name: String!,
        description: String!,
        price: Float!,
        stock: Int,
        category: String!,
        subcategory: String!,
        images: [String]
    ): Product!

    input UpdateProductInput {
      name: String
      description: String
      price: Float
      stock: Int
      images: [String]
      is_active: Boolean
      is_blocked: Boolean
  }
    updateProduct(id: ID!, updateData: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    searchProducts(query: String!): [Product]!
  }

`;