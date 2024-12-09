
// const SellerService = require('../services/SellerService');
// const sequelize = require('../config/db');

// const getActiveSellers = async (req, res, next) => {
//     try {
//         const activeSellers = await SellerService.getActiveSellers();

//         res.status(200).json({ status: 'success', data: activeSellers });
//     } catch (error) {
//         next(error);
//     }
// };

// const getActiveSellersById = async (req, res, next) => {
//     const { sellerId } = req.params;
//     try {
//         const activeSeller = await SellerService.getActiveSellersById(sellerId);

//         res.status(200).json({ status: 'success', data: activeSeller });
//     } catch (error) {
//         next(error);
//     }
// };

// const getNewSellers = async (req, res, next) => {
//     try {
//         const days = req.query.days || 7;
//         const newSellers = await SellerService.getNewSellers(days);

//         res.status(200).json({ status: 'success', data: newSellers });
//     } catch (error) {
//         next(error);
//     }
// };

// const getBlockedSellers = async (req, res, next) => {
//     try {
//         const blockedSellers = await SellerService.getBlockedSellers();
//         res.status(200).json({ status: 'success', data: blockedSellers })
//     } catch (error) {
//         next(error);
//     }
// };

// const getSellerStatistics = async (req, res, next) => {
//     try {
//         const usersStats = await SellerService.getSellerStatistics();
//         // Повернення результату
//         res.status(200).json({ data: usersStats });
//     } catch (error) {
//         next(error);
//     }
// };

// const getSellerStatisticsById = async (req, res, next) => {
//     const { sellerId } = req.params;
//     try {
//         const userStats = await SellerService.getSellerStatisticsById(sellerId);
//         res.status(200).json({ data: userStats });
//     } catch (error) {
//         next(error);
//     }
// }

// module.exports = {
//     getActiveSellers,
//     getActiveSellersById,
//     getNewSellers,
//     getBlockedSellers,
//     getSellerStatistics,
//     getSellerStatisticsById
// };

