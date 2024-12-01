// lib/apollo-client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql', // URL вашого GraphQL-сервера
    cache: new InMemoryCache(), // Налаштування кешу
});

export default client;
