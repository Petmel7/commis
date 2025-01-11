import { gql } from '@apollo/client';

export const GET_USER_STATUS = gql`
    query GetUserStatus {
        user {
            id
            isRegistered
            isGoogleRegistered
        }
    }
`;

export const GET_USER = gql`
    query GetUser {
        user {
            id
            name
            email
            role
            isBlocked
        }
    }
`;

import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
    query GetUserProfile {
        user {
            id
            phone
            confirmationCode
        }
    }
`;

export const CONFIRM_PHONE = gql`
    mutation ConfirmPhone($confirmationCode: String!) {
        confirmPhone(confirmationCode: $confirmationCode) {
            success
            message
        }
    }
`;
