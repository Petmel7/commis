
// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// const cors = require('cors');
// const cron = require('node-cron');
// const session = require('express-session');
// const passport = require('./config/passport');
// const sequelize = require('./config/db');
// const productRoutes = require('./routes/productRoutes');
// const userRoutes = require('./routes/userRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const favoriteRoutes = require('./routes/favoriteRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const catalogRoutes = require('./routes/catalogRoutes');
// const sizeRoutes = require('./routes/sizeRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const { errorHandler } = require('./middleware/errorHandler');
// const { deleteOldRefreshTokens } = require('./controllers/userController');
// const checkInactiveSellers = require('./tasks/checkInactiveSellers');

// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'default_session_secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// app.use('/api/products', productRoutes);
// app.use('/api/products', sizeRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/favorites', favoriteRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/catalog', catalogRoutes);
// app.use('/api/admin', adminRoutes);

// app.get('/', (req, res) => {
//     res.send('Welcome to the eCommerce API');
// });

// app.use(errorHandler);

// // Запуск задачі кожного дня в 00:00 для видалення старих refresh tokens
// cron.schedule('0 0 * * *', async () => {
//     await deleteOldRefreshTokens();
//     console.log('Scheduled task executed: old refresh tokens deleted');
// });

// // Налаштування cron job для запуску щодня о 2:00 ночі
// cron.schedule('0 2 * * *', () => {
//     console.log('Running daily inactive sellers check...');
//     checkInactiveSellers();
// });

// // Синхронізація моделей з базою даних
// sequelize.sync().then(() => {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }).catch(err => {
//     console.error('Unable to connect to the database:', err);
// });






const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/index');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
        // Декодуємо токен і перевіряємо користувача
        const token = req.headers.authorization || '';
        console.log('???????Authorization->token', token);
        if (token.startsWith('Bearer')) {
            try {
                const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

                // Отримуємо користувача з бази
                const user = await User.findByPk(decoded.id, {
                    attributes: ['id', 'name', 'email', 'role', 'is_blocked']
                });

                if (!user) {
                    throw new Error('User not found');
                }

                if (user.is_blocked) {
                    throw new Error('User is blocked');
                }

                return { user }; // Передаємо користувача у контекст
            } catch (error) {
                console.error('Authentication error:', error.message);
            }
        }
        return {}; // Якщо токена немає, повертаємо порожній контекст
    },
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

