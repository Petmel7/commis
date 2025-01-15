import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
    query GetProducts {
        products {
            id
            name
            description
            price
            stock
            images
        }
    }
`;

export const GET_USER_PRODUCTS = gql`
    query GetUserProducts {
        userProducts {
            id
            name
            price
            images
        }
    }
`;

export const GET_PRODUCT_DETAILS = gql`
    query GetProductDetails($productId: ID!) {
        product(productId: $productId) {
            id
            name
            description
            price
            images
            isBlocked
        }
    }
`;

export const GET_PRODUCT_DETAILS_WITH_SIZES = gql`
    query GetProductDetails($productId: ID!) {
        product(productId: $productId) {
            id
            name
            description
            price
            images
            sizes
        }
    }
`;

export const GET_FAVORITES = gql`
    query GetFavorites {
        favorites {
            id
            productId
        }
    }
`;


