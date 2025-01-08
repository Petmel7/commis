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

