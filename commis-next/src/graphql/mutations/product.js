import { gql } from '@apollo/client';

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($productId: ID!) {
        deleteProduct(productId: $productId) {
            success
            message
        }
    }
`;

export const DELETE_IMAGE = gql`
    mutation DeleteImage($productId: ID!, $indices: [Int!]!) {
        deleteImage(productId: $productId, indices: $indices) {
            success
            message
        }
    }
`;

export const GET_PRODUCT_BY_ID = gql`
    query GetProductById($productId: ID!) {
        product(productId: $productId) {
            id
            name
            description
            price
            stock
            category
            subcategory
            images
            sizes
        }
    }
`;

export const CREATE_OR_UPDATE_PRODUCT = gql`
    mutation CreateOrUpdateProduct(
        $id: ID
        $name: String!
        $description: String!
        $price: Float!
        $stock: Int!
        $category: String!
        $subcategory: String!
        $images: [Upload!]
        $sizes: [String!]
    ) {
        createOrUpdateProduct(
            id: $id
            name: $name
            description: $description
            price: $price
            stock: $stock
            category: $category
            subcategory: $subcategory
            images: $images
            sizes: $sizes
        ) {
            success
            message
            product {
                id
                name
                images
                sizes
            }
        }
    }
`;

