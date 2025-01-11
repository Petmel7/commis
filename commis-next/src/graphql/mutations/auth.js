import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
    mutation RegisterUser($name: String!, $email: String!, $password: String!) {
        registerUser(name: $name, email: $email, password: $password)
}
`;

export const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password)
}
`;

export const RESEND_CONFIRMATION_EMAIL = gql`
    mutation ResendConfirmationEmail($email: String!) {
        resendConfirmationEmail(email: $email)
    }
`;

export const CONFIRM_EMAIL = gql`
    mutation ConfirmEmail($token: String!) {
        confirmEmail(token: $token)
    }
`;

export const LOGOUT_USER = gql`
    mutation LogoutUser($refreshToken: String!) {
        logoutUser(refreshToken: $refreshToken) {
            success
            message
        }
    }
`;

export const GOOGLE_AUTH = gql`
    mutation GoogleAuth($idToken: String!) {
        googleAuth(idToken: $idToken) {
            accessToken
            refreshToken
            user {
                id
                name
                email
            }
        }
    }
`;



