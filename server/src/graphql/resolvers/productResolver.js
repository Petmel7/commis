const ProductService = require('../../services/ProductService');

const userResolver = {
    Query: {
        products: async () => {
            return await ProductService.getProducts();
        },
        product: async (_, { id }) => {
            return await ProductService.getProductById(id);
        },
    },
    Mutation: {
        getUserProducts: async (_, { userId }) => {
            return await ProductService.getUserProducts(userId);
        },
        addProduct: async (_, { userId, name, description, price, stock, category, subcategory, images }) => {
            return await ProductService.addProduct(userId, name, description, price, stock, category, subcategory, images);
        },
    },
};

module.exports = userResolver;