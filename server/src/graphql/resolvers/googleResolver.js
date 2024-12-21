// const { generateAccessToken, generateRefreshToken } = require('../../auth/auth');
// const { RefreshToken } = require('../../models');
// const { updateUserLoginStatus } = require('../../utils/userUtils');
// const passport = require('../../config/passport');

// const googleRsolvers = {
//     Mutation: {
//         googleAuthRedirect: async () => {
//             // URL для редіректу до Google OAuth
//             return 'https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:4000/google/callback&response_type=code&scope=profile email';
//         },
//         googleAuthCallback: async (_, { code }, { req, res }) => {
//             // Обробка callback після Google аутентифікації
//             return new Promise((resolve, reject) => {
//                 passport.authenticate('google', { session: false }, async (err, user) => {
//                     if (err || !user) {
//                         return reject(new Error('Failed to authenticate with Google.'));
//                     }

//                     req.login(user, async (err) => {
//                         if (err) {
//                             return reject(new Error('Login error.'));
//                         }
//                         try {
//                             // Оновлення статусу користувача
//                             await updateUserLoginStatus(user);

//                             // Генерація токенів
//                             const accessToken = generateAccessToken(user.id);
//                             const refreshToken = generateRefreshToken(user.id);

//                             // Збереження refreshToken
//                             await RefreshToken.create({ user_id: user.id, token: refreshToken });

//                             resolve({ accessToken, refreshToken });
//                         } catch (error) {
//                             console.error('Error during Google authentication:', error);
//                             reject(new Error('Failed to authenticate with Google.'));
//                         }
//                     });
//                 })(req, res);
//             });
//         },
//     },
// };

// module.exports = googleRsolvers;



const { generateAccessToken, generateRefreshToken } = require('../../auth/auth');
const { RefreshToken } = require('../../models');
const { updateUserLoginStatus } = require('../../utils/userUtils');
const passport = require('../../config/passport');

// const googleResolvers = {
//     Mutation: {
//         googleAuthRedirect: async () => {
//             return 'https://accounts.google.com/o/oauth2/auth?client_id=' +
//                 process.env.GOOGLE_CLIENT_ID +
//                 '&redirect_uri=http://localhost:4000/graphql/google/callback&response_type=code&scope=profile email';
//         },
//         googleAuthCallback: async (_, { code }, { req, res }) => {
//             return new Promise((resolve, reject) => {
//                 passport.authenticate('google', { session: false }, async (err, user) => {
//                     if (err || !user) {
//                         return reject(new Error('Failed to authenticate with Google.'));
//                     }

//                     try {
//                         await updateUserLoginStatus(user);

//                         const accessToken = generateAccessToken(user.id);
//                         const refreshToken = generateRefreshToken(user.id);

//                         await RefreshToken.create({ user_id: user.id, token: refreshToken });

//                         resolve({ accessToken, refreshToken });
//                     } catch (error) {
//                         console.error('Error during token generation:', error);
//                         reject(new Error('Failed to complete Google authentication.'));
//                     }
//                 })(req, res);
//             });
//         },
//     },
// };

// module.exports = googleResolvers;





const googleResolvers = {
    Mutation: {
        googleAuthRedirect: async () => {
            return 'https://accounts.google.com/o/oauth2/auth?client_id=' +
                process.env.GOOGLE_CLIENT_ID +
                '&redirect_uri=http://localhost:4000/graphql/google/callback&response_type=code&scope=profile email';
        },
        googleAuthCallback: async (_, { code }, { req, res }) => {
            return new Promise((resolve, reject) => {
                passport.authenticate('google', { session: false }, async (err, user) => {
                    if (err || !user) {
                        console.error('Authentication error:', err);
                        return reject(new Error('Failed to authenticate with Google.'));
                    }

                    try {
                        await updateUserLoginStatus(user);

                        const accessToken = generateAccessToken(user.id);
                        const refreshToken = generateRefreshToken(user.id);

                        await RefreshToken.create({ user_id: user.id, token: refreshToken });

                        resolve({ accessToken, refreshToken });
                    } catch (error) {
                        console.error('Error during token generation:', error);
                        reject(new Error('Failed to complete Google authentication.'));
                    }
                })(req, res);
            });
        },
    },
};

module.exports = googleResolvers;
