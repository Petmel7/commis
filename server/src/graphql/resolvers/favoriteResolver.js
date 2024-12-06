
const FavoriteService = require('../../services/FavoriteService');
const { ApolloError } = require('apollo-server-errors');

const favoriteResolvers = {
    Query: {
        getFavorites: async (_, __, { user }) => {
            if (!user) {
                throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
            }
            try {
                return await FavoriteService.getFavorites(user);
            } catch (error) {
                throw new ApolloError(error.message, error.code || 'INTERNAL_SERVER_ERROR');
            }
        },
    },
    Mutation: {
        addFavorite: async (_, { productId }, { user }) => {
            console.log('addFavorite->Resolver->user', user);
            if (!user) {
                throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
            }
            try {
                await FavoriteService.addFavorite(productId, user);
                return 'Product added to favorites';
            } catch (error) {
                throw new ApolloError(error.message, error.code || 'INTERNAL_SERVER_ERROR');
            }
        },
        deleteFavorite: async (_, { id }, { user }) => {
            if (!user) {
                throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
            }
            try {
                await FavoriteService.deleteFavorite(id, user);
                return 'Favorite deleted successfully';
            } catch (error) {
                throw new ApolloError(error.message, error.code || 'INTERNAL_SERVER_ERROR');
            }
        },
    },
};

module.exports = favoriteResolvers;
