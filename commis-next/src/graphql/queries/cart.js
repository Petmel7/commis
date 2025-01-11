import { gql } from '@apollo/client';

export const GET_CART = gql`
    query GetCart {
        cart {
            id
            items {
                id
                name
                size
                quantity
                price
            }
        }
    }
`;

export const ADD_TO_CART = gql`
    mutation AddToCart($productId: ID!, $size: String!) {
        addToCart(productId: $productId, size: $size) {
            id
            items {
                id
                name
                size
                quantity
                price
            }
        }
    }
`;

export const UPDATE_CART_ITEM = gql`
    mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
        updateCartItem(productId: $productId, quantity: $quantity) {
            id
            items {
                id
                name
                size
                quantity
                price
            }
        }
    }
`;

export const REMOVE_FROM_CART = gql`
    mutation RemoveFromCart($productId: ID!) {
        removeFromCart(productId: $productId) {
            id
            items {
                id
                name
                size
                quantity
                price
            }
        }
    }
`;

export const CLEAR_CART = gql`
    mutation ClearCart {
        clearCart {
            id
            items {
                id
                name
                size
                quantity
                price
            }
        }
    }
`;
