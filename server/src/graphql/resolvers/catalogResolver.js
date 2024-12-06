const CatalogService = require('../../services/CatalogService');
const { ApolloError } = require('apollo-server-errors');

const catalogResolvers = {
    Query: {
        getProductsByCategory: async (_, { category }) => {
            try {
                return await CatalogService.getProductsByCategory(category);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
};

module.exports = catalogResolvers;
