const SellerService = require('../../services/SellerService');
const { ApolloError } = require('apollo-server-errors');

const sellerResolvers = {
    Query: {
        getActiveSellers: async () => {
            try {
                return await SellerService.getActiveSellers();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getNewSellers: async () => {
            try {
                return await SellerService.getNewSellers();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getBlockedSellers: async () => {
            try {
                return await SellerService.getBlockedSellers();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getSellerStatistics: async () => {
            try {
                return await SellerService.getSellerStatistics();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getActiveSellersById: async (_, { sellerId }) => {
            try {
                return await SellerService.getActiveSellersById(sellerId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getSellerStatisticsById: async (_, { sellerId }) => {
            try {
                return await SellerService.getSellerStatisticsById(sellerId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
};

module.exports = sellerResolvers;