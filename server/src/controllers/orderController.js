
// const OrderService = require('../services/OrderService');
// const { sendOrderEmail } = require('../utils/emailUtils');

// const createOrder = async (req, res, next) => {
//     const { items, address } = req.body;

//     try {
//         const { order, total, orderDetails } = await OrderService.createOrder(req.user.id, items, address);

//         // Надсилання електронного листа
//         await sendOrderEmail(req.user.email, order.id, orderDetails, total);

//         res.status(201).json({ message: 'Order created successfully', orderId: order.id });
//     } catch (error) {
//         next(error);
//     }
// };

// const deleteOrder = async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         await OrderService.deleteOrder(id);

//         res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         next(error);
//     }
// };

// const getOrder = async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         const order = await OrderService.getOrder(id);

//         res.json(order);
//     } catch (error) {
//         next(error);
//     }
// };

// const getUserOrders = async (req, res, next) => {
//     try {
//         const orders = await OrderService.getUserOrders(req.user.id);

//         res.json(orders);
//     } catch (error) {
//         next(error);
//     }
// };

// const getSellerOrders = async (req, res, next) => {
//     try {
//         const sellerOrders = await OrderService.getSellerOrders(req.user.id);

//         res.json(sellerOrders);
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = {
//     createOrder,
//     deleteOrder,
//     getOrder,
//     getUserOrders,
//     getSellerOrders
// };