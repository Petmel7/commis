const { User, Order, Product, OrderItem, RefreshToken } = require('../models');

const getUserRoleCounts = async () => {
    const users = await User.findAll({
        attributes: ['id', 'name', 'phone', 'email', 'role'],
    });

    const roles = {
        buyer: { title: "Покупці", slug: "buyer", count: 0, users: [] },
        seller: { title: "Продавці", slug: "seller", count: 0, users: [] },
        superadmin: { title: "Адміністратори", slug: "admin", count: 0, users: [] },
    };

    users.forEach(user => {
        const { id, name, phone, email, role } = user;
        if (roles[role]) {
            roles[role].count += 1;
            roles[role].users.push({ id, name, phone, email, role: roles[role].title });
        }
    });

    return Object.values(roles);
};

const getUsersByRole = async (role) => {
    if (!role) {
        throw new Error('Role not specified');
    }

    const users = await User.findAll({
        where: { role },
        attributes: ['id', 'name', 'email', 'phone', 'role', 'created_at']
    });

    if (users.length === 0) {
        throw new Error('Users with role ${role} not found');
    }

    return users;
};

const deleteUser = async (userId) => {
    if (!userId) {
        throw new Error('userId not passed in the request');
    }

    const orders = await Order.findAll({ where: { user_id: userId } });

    const orderIds = orders.map(order => order.id);

    await OrderItem.destroy({ where: { order_id: orderIds } });

    await Order.destroy({ where: { user_id: userId } });

    await RefreshToken.destroy({ where: { user_id: userId } });

    await User.destroy({ where: { id: userId } });
}

const updateUser = async (userId, { name, email, phone, role }) => {

    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('No user found');
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    await user.save();

    return {
        user: {
            id: user.id || null,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    };
}

const blockUser = async (userId, isBlocked) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('No user found');
    }

    await user.update({ is_blocked: isBlocked });

    return user;
}

const blockProduct = async (productId, isBlocked) => {
    const product = await Product.findByPk(productId);
    if (!productId) {
        throw new Error('No product found');
    }

    await product.update({ is_blocked: isBlocked });

    return product;
}

module.exports = {
    getUserRoleCounts,
    getUsersByRole,
    deleteUser,
    updateUser,
    blockUser,
    blockProduct
}