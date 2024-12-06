const { gql } = require('apollo-server-express');

const orderTypeDefs = gql`
  type Order {
    id: ID!
    user_id: ID!
    total: Int!
    region: String!
    city: String!
    postoffice: String!
    status: String!
    createdat: String!
    updatedat: String!
    items: [OrderItem]! # Масив може бути порожнім, але не null
  }

  type OrderItem {
    id: ID!
    order_id: ID!
    product_id: ID!
    quantity: Int!
    price: Int!
    size: String
    createdat: String!
    updatedat: String!
    product: Product!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    images: [String]
    is_active: Boolean
    is_blocked: Boolean
    created_at: String
    updated_at: String
  }

  type Seller {
    email: String!
    name: String!
    lastname: String!
  }

  type CreateOrderResponse {
    order: Order!
    total: Int!
    orderDetails: String!
    sellers: [String!]!
  }

  input AddressInput {
    region: String!
    city: String!
    postoffice: String!
}

  input OrderItemInput {
    product_id: ID!
    quantity: Int!
    size: String
  }

  type SellerOrder {
    order_id: ID!
    buyer_name: String!
    buyer_email: String!
    buyer_phone: String!
    shipping_address: ShippingAddress!
    products: [SellerOrderProduct!]!
  }

  type ShippingAddress {
    region: String!
    city: String!
    postoffice: String!
  }

  type SellerOrderProduct {
    product_name: String!
    product_price: Float!
    product_images: [String]
    quantity: Int!
    product_size: String
  }

  type Query {
    orders: [Order!]!
    order(id: ID!): Order
    getOrderWithProducts(id: ID!): Order!
    getUserOrders(userId: ID!): [Order!]!
    getSellerOrders(sellerId: ID!): [SellerOrder!]!
  }

  type Mutation {
    createOrder(userId: ID!, items: [OrderItemInput!]!, address: [AddressInput!]!): CreateOrderResponse!
    deleteOrder(id: ID!): String!
 }
`;

module.exports = orderTypeDefs;
