const { mergeTypeDefs } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// Імпорт схем
const userTypeDefs = require('./typeDefs/user');
const productTypeDefs = require('./typeDefs/product');
const orderTypeDefs = require('./typeDefs/order');
const favoriteTypeDefs = require('./typeDefs/favorite');
const catalogTypeDefs = require('./typeDefs/catalog');

// Імпорт резольверів
const userResolvers = require('./resolvers/userResolver');
const productResolvers = require('./resolvers/productResolver');
const orderResolvers = require('./resolvers/orderResolver');
const favoriteResolvers = require('./resolvers/favoriteResolver');
const catalogResolvers = require('./resolvers/catalogResolver');

// Об'єднання схем і резольверів
const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([
        userTypeDefs,
        productTypeDefs,
        orderTypeDefs,
        favoriteTypeDefs,
        catalogTypeDefs
    ]),
    resolvers: [
        userResolvers,
        productResolvers,
        orderResolvers,
        favoriteResolvers,
        catalogResolvers
    ],
});

module.exports = schema;

