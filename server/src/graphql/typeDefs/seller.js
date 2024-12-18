const { gql } = require('apollo-server-express');

const sellerTypeDefs = gql`
    # Тип користувача
    type User {
        id: ID
        name: String
        email: String
        role: String
        is_blocked: Boolean
        last_login: String
        created_at: String
        updated_at: String
        products: [Product!]
        orders: [Order!]
    }

    # Тип товару
    type Product {
        id: ID!
        name: String!
        description: String
        price: Float!
        stock: Int!
        is_active: Boolean!
        created_at: String
        updated_at: String
    }

    # Тип замовлення
    type Order {
        id: ID!
        status: String!
        created_at: String!
        updated_at: String
        total: Float
    }

    # Тип статистики
    type SellerStatistics {
        totalSellers: Int
        activeSellers: Int
        blockedSellers: Int
        newSellers: Int
    }

    # Вхідний запит для статистики продавця
    input SellerStatisticsInput {
        sellerId: ID
    }

    # Тип запитів
    type Query {
        # Отримати список активних продавців
        getActiveSellers: [User!]!

        # Отримати нового продавця за останні дні
        getNewSellers(days: Int): [User!]!

        # Отримати список заблокованих продавців
        getBlockedSellers: [User!]!

        # Отримати загальну статистику продавців
        getSellerStatistics: SellerStatistics

        # Отримати дані активного продавця за ID
        getActiveSellersById(sellerId: ID!): User!

        # Отримати статистику конкретного продавця
        getSellerStatisticsById(sellerId: ID!): SellerStatistics!
    }
`;

module.exports = sellerTypeDefs;
