
const { User, Order, Product } = require('../models');
const sequelize = require('../config/db');

const getUsersForAdmin = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const getOrdersForAdmin = async (req, res, next) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const getProductsForAdmin = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const getUserRoleCounts = async (req, res, next) => {
    try {
        // Отримання всіх користувачів з розбивкою на ролі
        const users = await User.findAll({
            attributes: ['id', 'name', 'phone', 'email', 'role'],  // Отримання імені, телефону, пошти та ролі
        });

        // Ініціалізація підрахунків і масивів для кожної ролі
        const buyers = {
            title: "Покупці",
            slug: "buyer",
            count: 0,
            users: []
        };

        const sellers = {
            title: "Продавці",
            slug: "seller",
            count: 0,
            users: []
        };

        const admins = {
            title: "Адміністратори",
            slug: "admin",
            count: 0,
            users: []
        };

        // Перебір усіх користувачів і сортування за ролями
        users.forEach(user => {
            const { id, name, phone, email, role } = user;

            if (role === 'buyer') {
                buyers.count += 1;
                buyers.users.push({ id, name, phone, email, role: 'Покупець' });
            } else if (role === 'seller') {
                sellers.count += 1;
                sellers.users.push({ id, name, phone, email, role: 'Продавець' });
            } else if (role === 'superadmin') {
                admins.count += 1;
                admins.users.push({ id, name, phone, email, role: 'Адміністратор' });
            }
        });

        // Формуємо масив з даними про користувачів
        const result = [buyers, sellers, admins];

        // Відправляємо результат
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Функція для отримання користувачів за роллю
const getUsersByRole = async (req, res, next) => {
    const { role } = req.params; // Отримання ролі з параметрів запиту

    try {
        // Перевірка наявності ролі
        if (!role) {
            return res.status(400).json({ message: 'Роль не вказана' });
        }

        // Пошук користувачів з вказаною роллю
        const users = await User.findAll({
            where: { role }, // Умова для пошуку за полем role
            attributes: ['id', 'name', 'email', 'phone', 'role'] // Поля, які хочемо отримати
        });

        if (users.length === 0) {
            return res.status(404).json({ message: `Користувачі з роллю ${role} не знайдені` });
        }

        res.status(200).json(users); // Відправка списку знайдених користувачів
    } catch (error) {
        next(error); // Передача помилки в наступний обробник
    }
};

module.exports = {
    getUsersForAdmin,
    getOrdersForAdmin,
    getProductsForAdmin,
    getUserRoleCounts,
    getUsersByRole
};
