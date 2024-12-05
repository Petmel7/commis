const UserService = require('../../services/UserService');
const { ApolloError } = require('apollo-server-errors');

const userResolver = {
    Query: {
        users: async () => {
            try {
                return await UserService.getAllUsers();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        user: async (_, { id }) => {
            try {
                return await UserService.getUserById(id);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getUserProfile: async (_, { userId }) => {
            try {
                return await UserService.getUserProfile(userId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
    Mutation: {
        registerUser: async (_, { name, lastname, email, password }) => {
            try {
                return await UserService.registerUser({ name, lastname, email, password });
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        confirmEmail: async (_, { token }) => {
            try {
                return await UserService.confirmEmail(token);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        addPhoneNumber: async (_, { phone, userId }) => {
            try {
                return await UserService.addPhoneNumber(phone, userId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        confirmPhoneNumber: async (_, { userId, confirmationcode }) => {
            try {
                return await UserService.confirmPhoneNumber(userId, confirmationcode);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        loginUser: async (_, { email, password }) => {
            try {
                return await UserService.loginUser(email, password);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        logoutUser: async (_, { token }) => {
            try {
                return await UserService.logoutUser(token);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        refreshToken: async (_, { token }) => {
            try {
                return await UserService.refreshToken(token);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
};

module.exports = userResolver;
