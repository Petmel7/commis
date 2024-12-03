const { User, Order, Product, OrderItem, RefreshToken } = require('../models');

const getUsersForAdmin = async () => { //Перенесена в UserService
    const users = await User.findAll();
    return users;
}

const getUserById = async (id) => { //Перенесена в UserService
    const user = await User.findByPk(id);

    if (!user) {
        throw { status: 404, message: 'User not found' };
    }

    return user;
}

const getOrdersForAdmin = async (id) => {
    const orders = await Order.findAll();

    if (!orders) {
        throw { status: 404, message: 'Orders not found' };
    }

    return orders;
}

const getProductsForAdmin = async (id) => {
    const products = await Order.findAll();

    if (!products) {
        throw { status: 404, message: 'Products not found' };
    }

    return products;
}

const getUserRoleCounts = async () => {
    // Отримуємо всіх користувачів з необхідними атрибутами
    const users = await User.findAll({
        attributes: ['id', 'name', 'phone', 'email', 'role'],
    });

    // Ініціалізуємо ролі
    const roles = {
        buyer: { title: "Покупці", slug: "buyer", count: 0, users: [] },
        seller: { title: "Продавці", slug: "seller", count: 0, users: [] },
        superadmin: { title: "Адміністратори", slug: "admin", count: 0, users: [] },
    };

    // Групуємо користувачів за ролями
    users.forEach(user => {
        const { id, name, phone, email, role } = user;
        if (roles[role]) {
            roles[role].count += 1;
            roles[role].users.push({ id, name, phone, email, role: roles[role].title });
        }
    });

    // Повертаємо ролі у вигляді масиву
    return Object.values(roles);
};

const getUsersByRole = async (role) => {
    // Перевірка наявності ролі
    if (!role) {
        throw { status: 400, message: 'Роль не вказана' };
    }

    // Пошук користувачів з вказаною роллю
    const users = await User.findAll({
        where: { role }, // Умова для пошуку за полем role
        attributes: ['id', 'name', 'email', 'phone', 'role', 'createdat'] // Поля, які хочемо отримати
    });

    if (users.length === 0) {
        throw { status: 404, message: `Користувачі з роллю ${role} не знайдені` };
    }

    return users;
};

const deleteUserForAdmin = async (userId) => {
    if (!userId) {
        throw { status: 400, message: 'userId не переданий у запиті' };
    }

    // Отримуємо всі замовлення користувача
    const orders = await Order.findAll({ where: { user_id: userId } });

    // Видаляємо всі записи в order_items, пов'язані з кожним замовленням
    const orderIds = orders.map(order => order.id);
    await OrderItem.destroy({ where: { order_id: orderIds } });

    // Видаляємо замовлення користувача
    await Order.destroy({ where: { user_id: userId } });

    await RefreshToken.destroy({ where: { user_id: userId } });

    // Видаляємо користувача
    await User.destroy({ where: { id: userId } });
}

const updateUser = async (userId) => {
    // Знаходимо користувача в базі даних
    const user = await User.findByPk(userId);
    if (!user) {
        throw { status: 404, message: 'Користувача не знайдено' };
    }

    // Оновлюємо дані користувача
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    // Зберігаємо зміни
    await user.save();

    // Відправляємо успішну відповідь із оновленими даними користувача
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    };
}

const blockUser = async (userId, is_blocked) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw { status: 404, message: 'Користувача не знайдено' };
    }

    // Оновлюємо статус блокування
    await user.update({ is_blocked });

    return user;
}

const blockProduct = async (productId, is_blocked) => {
    const product = await Product.findByPk(productId);
    if (!productId) {
        throw { status: 404, message: 'Продукту не знайдено' };
    }

    // Оновлюємо статус блокування
    await product.update({ is_blocked });

    return product;
}

module.exports = {
    getUsersForAdmin,
    getUserById,
    getOrdersForAdmin,
    getProductsForAdmin,
    getUserRoleCounts,
    getUsersByRole,
    deleteUserForAdmin,
    updateUser,
    blockUser,
    blockProduct
}