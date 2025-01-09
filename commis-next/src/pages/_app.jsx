
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import client from '../lib/apollo-client';
// import client from '@/apollo/client';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <FavoritesProvider>
                <AuthProvider>
                    <CartProvider>
                        <Layout>
                            <div className='container'>
                                <Component {...pageProps} />
                            </div>
                        </Layout>
                    </CartProvider>
                </AuthProvider>
            </FavoritesProvider>
        </ApolloProvider>
    );
}

export default MyApp;

