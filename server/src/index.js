
// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const schema = require('./graphql/index');
// const dotenv = require('dotenv');
// const sequelize = require('./config/db');
// const jwt = require('jsonwebtoken');
// const User = require('./models/User');
// const cors = require('cors');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const server = new ApolloServer({
//     schema,
//     context: async ({ req }) => {
//         // Декодуємо токен і перевіряємо користувача
//         const token = req.headers.authorization || '';
//         console.log('???????Authorization->token', token);
//         if (token.startsWith('Bearer')) {
//             try {
//                 const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

//                 // Отримуємо користувача з бази
//                 const user = await User.findByPk(decoded.id, {
//                     attributes: ['id', 'name', 'email', 'role', 'is_blocked']
//                 });

//                 if (!user) {
//                     throw new Error('User not found');
//                 }

//                 if (user.is_blocked) {
//                     throw new Error('User is blocked');
//                 }

//                 return { user }; // Передаємо користувача у контекст
//             } catch (error) {
//                 console.error('Authentication error:', error.message);
//             }
//         }
//         return {}; // Якщо токена немає, повертаємо порожній контекст
//     },
// });

// // Інтеграція з Express
// server.start().then(() => {
//     server.applyMiddleware({ app, path: '/graphql' });

//     // Синхронізація з базою даних
//     sequelize.sync().then(() => {
//         const PORT = process.env.PORT || 5000;
//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//             console.log(`GraphQL endpoint available at /graphql`);
//         });
//     }).catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });
// });




// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const passport = require('./config/passport');
// const schema = require('./graphql/index');
// const dotenv = require('dotenv');
// const sequelize = require('./config/db');
// const jwt = require('jsonwebtoken');
// const User = require('./models/User');
// const cors = require('cors');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Ініціалізація Passport
// app.use(passport.initialize());

// // Маршрут для Google OAuth
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get(
//     '/auth/google/callback',
//     passport.authenticate('google', { session: false }),
//     async (req, res) => {
//         try {
//             const user = req.user;
//             if (!user) {
//                 return res.status(401).json({ message: 'Authentication failed' });
//             }

//             // Генеруємо токени
//             const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//             const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

//             // Повертаємо токени
//             res.redirect(
//                 `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
//             );
//         } catch (error) {
//             console.error('Error during Google OAuth callback:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     }
// );

// const server = new ApolloServer({
//     schema,
//     context: async ({ req }) => {
//         // Декодуємо токен і перевіряємо користувача
//         const token = req.headers.authorization || '';
//         console.log('???????Authorization->token', token);
//         if (token.startsWith('Bearer')) {
//             try {
//                 const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

//                 // Отримуємо користувача з бази
//                 const user = await User.findByPk(decoded.id, {
//                     attributes: ['id', 'name', 'email', 'role', 'is_blocked'],
//                 });

//                 if (!user) {
//                     throw new Error('User not found');
//                 }

//                 if (user.is_blocked) {
//                     throw new Error('User is blocked');
//                 }

//                 return { user }; // Передаємо користувача у контекст
//             } catch (error) {
//                 console.error('Authentication error:', error.message);
//             }
//         }
//         return {}; // Якщо токена немає, повертаємо порожній контекст
//     },
// });

// // Інтеграція з Express
// server.start().then(() => {
//     server.applyMiddleware({ app, path: '/graphql' });

//     // Синхронізація з базою даних
//     sequelize
//         .sync()
//         .then(() => {
//             const PORT = process.env.PORT || 5000;
//             app.listen(PORT, () => {
//                 console.log(`Server running on port ${PORT}`);
//                 console.log(`GraphQL endpoint available at /graphql`);
//             });
//         })
//         .catch((err) => {
//             console.error('Unable to connect to the database:', err);
//         });
// });




const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/index');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }), // Передаємо req і res у контекст
});

// Інтеграція з Express
server.start().then(() => {
    server.applyMiddleware({ app, path: '/graphql' });

    // Синхронізація з базою даних
    sequelize.sync().then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`GraphQL endpoint available at /graphql`);
        });
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
});


