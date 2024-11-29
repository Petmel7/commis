const UserService = require('../../services/UserService');

const userResolver = {
    Query: {
        users: async () => {
            return await UserService.getAllUsers();
        },
        user: async (_, { id }) => {
            return await UserService.getUserById(id);
        },
    },
    Mutation: {
        registerUser: async (_, { name, lastname, email, password }) => {
            await UserService.registerUser({ name, lastname, email, password });
            return 'User registered successfully. Please check your email to confirm.';
        },
        confirmEmail: async (_, { token }) => {
            return await UserService.confirmEmail(token);
        },
        addPhoneNumber: async (_, { phone, userId }) => {
            return await UserService.addPhoneNumber(phone, userId);
        },
        confirmPhoneNumber: async (_, { userId, confirmationcode }) => {
            return await UserService.confirmPhoneNumber(userId, confirmationcode);
        },
        loginUser: async (_, { email, password }) => {
            return await UserService.loginUser(email, password);
        },
        logoutUser: async (_, { token }) => {
            return await UserService.loginUser(token);
        },
        getUserProfile: async (_, { userId }) => {
            return await UserService.getUserProfile(userId);
        },
        refreshToken: async (_, { token }) => {
            return await UserService.refreshToken(token);
        },
    },
};

module.exports = userResolver;
