
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
    context: ({ req, res }) => ({ req, res }),
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


