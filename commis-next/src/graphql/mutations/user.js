import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
    query GetUserProfile {
        user {
            id
            name
            email
            role
            isBlocked
        }
    }
`;

export const ADD_PHONE = gql`
    mutation AddPhone($phone: String!) {
        addPhone(phone: $phone) {
            success
            message
        }
    }
`;

