import { gql } from '@apollo/client';

export const GET_FAVORITES = gql`
    query GetFavorites {
        favorites {
            id
            name
            price
            image
        }
    }
`;

export const ADD_FAVORITE = gql`
    mutation AddFavorite($productId: ID!) {
        addFavorite(productId: $productId) {
            id
            name
            price
            image
        }
    }
`;

export const REMOVE_FAVORITE = gql`
    mutation RemoveFavorite($favoriteId: ID!) {
        removeFavorite(favoriteId: $favoriteId) {
            id
        }
    }
`;

export const GET_FAVORITE_IDS = gql`
    query GetFavoriteIds {
        favorites {
            id
            productId
        }
    }
`;

