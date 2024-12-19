const AdminService = require('../../services/AdminService');
const { ApolloError } = require('apollo-server-errors');

const adminResolver = {
    Query: {
        getUserRoleCounts: async () => {
            try {
                return await AdminService.getUserRoleCounts();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getUsersByRole: async (_, { role }) => {
            try {
                return await AdminService.getUsersByRole(role);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
    Mutation: {
        deleteUser: async (_, args) => {
            const userId = args.userId;
            try {
                return await AdminService.deleteUser(parseInt(userId, 10));
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        updateUser: async (_, { userId, name, email, phone, role }) => {
            try {
                const result = await AdminService.updateUser(userId, { name, email, phone, role });
                return result.user;
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        blockUser: async (_, { userId, isBlocked }) => {
            try {
                return await AdminService.blockUser(userId, isBlocked);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        blockProduct: async (_, { productId, isBlocked }) => {
            try {
                return await AdminService.blockProduct(productId, isBlocked);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
};

module.exports = adminResolver;