
const { Product, User, Order, OrderItem } = require('../models');
const { validateTimestamps } = require('../validators/validators');
const path = require('path');

const getAllOrders = async () => {
    const orders = await Order.findAll();

    if (!orders) {
        throw new Error('Замовлення не знайдено');
    }

    return orders;
}

const getOrderById = async (id) => {
    const order = await Order.findByPk(id);

    if (!order) {
        throw new Error('Замовлення не знайдено');
    }

    return order;
}

// Функція для перевірки наявності продукту та доступності на складі
const getProductAndValidateStock = async (productId, quantity) => {
    const product = await Product.findByPk(productId);
    if (!product) {
        throw new Error(`Product with id ${productId} not found`);
    }
    if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Only ${product.stock} items left.`);
    }
    return product;
};

// const generateOrderDetails = async (items) => {
//     let total = 0;
//     let orderDetails = '';
//     const sellers = new Set();

//     for (const item of items) {
//         const product = await getProductAndValidateStock(item.product_id, item.quantity);
//         total += product.price * item.quantity;

//         const productImageURL = `http://localhost:5000/uploads/${path.basename(product.images[0])}`;
//         const seller = await User.findByPk(product.user_id, { attributes: ['name', 'lastname', 'email'] });
//         if (seller) sellers.add(seller.email);

//         orderDetails += `
//             <tr>
//                 <td><img src="${productImageURL}" alt="${product.name}" width="50"/></td>
//                 <td>${product.name}</td>
//                 <td>${item.quantity}</td>
//                 <td>${product.price}</td>
//                 <td>${seller.name} ${seller.lastname}</td>
//             </tr>`;
//     }

//     return { total, orderDetails, sellers };
// };

const createOrder = async (userId, items, address) => {
    let total = 0;
    let orderDetails = '';
    const sellers = new Set();

    // Генеруємо деталі замовлення
    for (const item of items) {
        const product = await getProductAndValidateStock(item.product_id, item.quantity);
        total += product.price * item.quantity;

        const productImageURL = `http://localhost:5000/uploads/${path.basename(product.images[0])}`;
        const seller = await User.findByPk(product.user_id, { attributes: ['name', 'lastname', 'email'] });
        if (seller) sellers.add(seller.email);

        orderDetails += `
            <tr>
                <td><img src="${productImageURL}" alt="${product.name}" width="50"/></td>
                <td>${product.name}</td>
                <td>${item.quantity}</td>
                <td>${product.price}</td>
                <td>${seller.name} ${seller.lastname}</td>
            </tr>`;
    }

    // Створюємо замовлення
    const order = await Order.create({
        user_id: userId,
        total,
        region: address[0].region,
        city: address[0].city,
        postoffice: address[0].postoffice,
    });

    // Додаємо позиції до замовлення
    for (const item of items) {
        const product = await getProductAndValidateStock(item.product_id, item.quantity);
        await OrderItem.create({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price * item.quantity,
            size: item.size,
        });

        // Оновлюємо залишок на складі
        await product.update({ stock: product.stock - item.quantity });
    }

    return { order, total, orderDetails, sellers };
};

const deleteOrder = async (id) => {
    const order = await Order.findByPk(id);
    if (!order) {
        throw { status: 404, message: 'Order not found' };
    }

    const orderItems = await OrderItem.findAll({ where: { order_id: id } });

    for (let item of orderItems) {
        const product = await Product.findByPk(item.product_id);
        await product.update({ stock: product.stock + item.quantity });
    }

    await OrderItem.destroy({ where: { order_id: id } });
    await Order.destroy({ where: { id } });

    return 'Замовлення успішно видалене!';
};

const getOrderWithProducts = async (id) => {
    const order = await Order.findByPk(id, {
        include: [
            {
                model: OrderItem,
                include: [Product]
            }
        ]
    });

    if (!order) {
        throw new Error('Order not found');
    }

    validateTimestamps(order);

    return order;
};

const getUserOrders = async (userId) => {
    const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
            {
                model: OrderItem,
                required: false,
                include: [Product]
            }
        ]
    });

    // Перевіряємо кожне замовлення в масиві
    orders.forEach((order) => validateTimestamps(order));

    return orders;
};

const getSellerOrders = async (sellerId) => {
    const sellerOrders = await Order.findAll({
        include: [
            {
                model: OrderItem,
                required: true,
                include: [
                    {
                        model: Product,
                        required: true,
                        where: { user_id: sellerId },
                        include: [{ model: User, as: 'seller', attributes: ['name', 'email', 'phone'] }]
                    }
                ]
            },
            {
                model: User,
                as: 'buyer',
                attributes: ['name', 'email', 'phone']
            }
        ]
    });

    return sellerOrders.map(order => ({
        order_id: order.id,
        buyer_name: order.buyer.name,
        buyer_email: order.buyer.email,
        buyer_phone: order.buyer.phone,
        shipping_address: {
            region: order.region,
            city: order.city,
            postoffice: order.postoffice
        },
        products: order.OrderItems.map(item => ({
            product_name: item.Product.name,
            product_price: item.Product.price,
            product_images: item.Product.images,
            quantity: item.quantity,
            product_size: item.size
        }))
    }));
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder,
    getOrderWithProducts,
    getUserOrders,
    getSellerOrders,
    getProductAndValidateStock
};