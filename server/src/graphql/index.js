const { mergeTypeDefs } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const userTypeDefs = require('./typeDefs/user');
const userResolvers = require('./resolvers/userResolver');

const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([userTypeDefs]),
    resolvers: [userResolvers],
});

module.exports = schema;
