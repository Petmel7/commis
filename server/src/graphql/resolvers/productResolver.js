const ProductService = require('../../services/ProductService');
const { ApolloError } = require('apollo-server-errors');

const productResolvers = {
    Query: {
        products: async () => {
            try {
                return await ProductService.getAllProducts();
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        product: async (_, { id }) => {
            try {
                return await ProductService.getProductById(id);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        getSellerProducts: async (_, { userId }) => {
            try {
                return await ProductService.getSellerProducts(userId);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
    Mutation: {
        addProduct: async (_, { userId, name, description, price, stock, category, subcategory, images }) => {

            try {
                return await ProductService.addProduct(userId, name, description, price, stock, category, subcategory, images);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        updateProduct: async (_, { id, updateData }) => {
            try {
                return await ProductService.updateProduct(id, updateData);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        deleteProduct: async (_, { id }) => {
            try {
                return await ProductService.deleteProduct(id);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        deleteImagesFromProduct: async (_, { productId, indices }) => {
            try {
                return await ProductService.deleteImagesFromProduct(productId, indices);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
        searchProducts: async (_, { query }) => {
            try {
                return await ProductService.searchProducts(query);
            } catch (error) {
                throw new ApolloError(error.message, error.code || "INTERNAL_SERVER_ERROR");
            }
        },
    },
};

module.exports = productResolvers;