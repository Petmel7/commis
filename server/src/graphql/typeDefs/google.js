
const { gql } = require('apollo-server-express');

const googleTypeDefs = gql`
  type Mutation {
    googleAuthRedirect: String! # Повертає URL для Google аутентифікації
    googleAuthCallback(code: String!): AuthResponse! # Обробляє callback і повертає токени
}

  type AuthResponse {
    accessToken: String!
    refreshToken: String!
}
`;

module.exports = googleTypeDefs;