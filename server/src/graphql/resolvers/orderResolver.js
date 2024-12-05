const OrderService = require('../../services/OrderService');
const { ApolloError } = require('apollo-server-errors');

const orderResolvers = {
    Query: {
        orders: async () => {
            try {
                return await OrderService.getAllOrders();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        order: async (_, { id }) => {
            try {
                return await OrderService.getOrderById(id);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getOrderWithProducts: async (_, { id }) => {
            try {
                return await OrderService.getOrderWithProducts(id);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getUserOrders: async (_, { userId }) => {
            try {
                return await OrderService.getUserOrders(userId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getSellerOrders: async (_, { sellerId }) => {
            try {
                return await OrderService.getSellerOrders(sellerId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
    Mutation: {
        createOrder: async (_, { userId, items, address }) => {
            try {
                return await OrderService.createOrder(userId, items, address);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        deleteOrder: async (_, { id }) => {
            try {
                return await OrderService.deleteOrder(id);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },

    },
};

module.exports = orderResolvers;