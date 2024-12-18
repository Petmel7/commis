const { mergeTypeDefs } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const userTypeDefs = require('./typeDefs/user');
const productTypeDefs = require('./typeDefs/product');
const orderTypeDefs = require('./typeDefs/order');
const favoriteTypeDefs = require('./typeDefs/favorite');
const catalogTypeDefs = require('./typeDefs/catalog');
const sellerTypeDefs = require('./typeDefs/seller');
const sizeTypeDefs = require('./typeDefs/size');
const adminTypeDefs = require('./typeDefs/admin');

const userResolvers = require('./resolvers/userResolver');
const productResolvers = require('./resolvers/productResolver');
const orderResolvers = require('./resolvers/orderResolver');
const favoriteResolvers = require('./resolvers/favoriteResolver');
const catalogResolvers = require('./resolvers/catalogResolver');
const sellerResolvers = require('./resolvers/sellerResolver');
const sizesResolvers = require('./resolvers/sizesResolver');
const adminResolvers = require('./resolvers/adminResolver');

const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([
        userTypeDefs,
        productTypeDefs,
        orderTypeDefs,
        favoriteTypeDefs,
        catalogTypeDefs,
        sellerTypeDefs,
        sizeTypeDefs,
        adminTypeDefs
    ]),
    resolvers: [
        userResolvers,
        productResolvers,
        orderResolvers,
        favoriteResolvers,
        catalogResolvers,
        sellerResolvers,
        sizesResolvers,
        adminResolvers
    ],
});

module.exports = schema;

