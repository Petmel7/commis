
const SizesService = require('../../services/SizesService');
const { ApolloError } = require('apollo-server-errors');

const sizesResolvers = {
    Query: {
        getSizesByProductId: async (_, { productId }) => {
            try {
                return await SizesService.getSizesByProductId(productId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || 'INTERNAL_SERVER_ERROR');
            }
        },
    },
    Mutation: {
        addSizeToProduct: async (_, { productId, sizes }) => {
            try {
                return await SizesService.addSizeToProduct(productId, sizes);
            } catch (error) {
                throw new ApolloError(error.message, error.code || 'INTERNAL_SERVER_ERROR');
            }
        },
        removeSizeFromProduct: async (_, { productId, sizeId }) => {
            try {
                return await SizesService.removeSizeFromProduct(productId, sizeId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || 'INTERNAL_SERVER_ERROR');
            }
        },
    },
};

module.exports = sizesResolvers;