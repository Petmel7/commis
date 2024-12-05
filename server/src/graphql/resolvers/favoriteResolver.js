const FavoriteService = require('../../services/FavoriteService');
const { ApolloError } = require('apollo-server-errors');

const favoriteResolvers = {
    Query: {
        getFavorites: async (_, __, { req }) => {
            try {
                return await FavoriteService.getFavorites(req);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
    Mutation: {
        addFavorite: async (_, { productId }, { req }) => {
            try {
                return await FavoriteService.addFavorite(productId, req);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        deleteFavorite: async (_, { id }, { req }) => {
            try {
                return await FavoriteService.deleteFavorite(id, req);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },

    },
};

module.exports = favoriteResolvers;