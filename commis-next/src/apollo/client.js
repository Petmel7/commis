import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApolloLink } from '@apollo/client';

// HTTP Link для запитів до GraphQL
const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql', // Ваш GraphQL сервер
});

// Auth Link для додавання токенів до заголовків
const authLink = setContext((_, { headers }) => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        headers: {
            ...headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
    };
});

// Error Link для обробки помилок, включаючи оновлення токенів
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            if (err.extensions.code === 'UNAUTHENTICATED') {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    return fetch('http://localhost:5000/api/users/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: refreshToken }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            localStorage.setItem('accessToken', data.accessToken);
                            localStorage.setItem('refreshToken', data.refreshToken);

                            operation.setContext({
                                headers: {
                                    ...operation.getContext().headers,
                                    Authorization: `Bearer ${data.accessToken}`,
                                },
                            });

                            return forward(operation);
                        })
                        .catch((err) => {
                            console.error('Token refresh failed', err);
                            return null;
                        });
                }
            }
        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;
