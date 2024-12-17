const { User, Product, Order } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const { getSellerStatisticsQuery } = require('../utils/queries');

const getActiveSellers = async () => {
    const activeSellers = await User.findAll({
        where: {
            role: 'seller',
            is_blocked: false,
            last_login: {
                [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        },
        include: [
            {
                model: Product,
                as: 'products',
                where: {
                    is_active: true,
                },
                required: true
            },
            {
                model: Order,
                as: 'orders',
                where: {
                    status: {
                        [Op.in]: ['shipped', 'completed', 'cancelled']
                    },
                    created_at: {
                        [Op.gte]: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) // Продажі за останні 6 місяців
                    }
                },
                required: false
            }
        ]
    });
    return activeSellers;
};

const getNewSellers = async (days = 7) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);

    const newSellers = await User.findAll({
        where: {
            role: 'seller',
            created_at: {
                [Op.gte]: thresholdDate,
            },
        },
        attributes: ['id', 'name', 'email', 'created_at'],
    });

    return newSellers;
};

const getBlockedSellers = async () => {
    const blockedSellers = await User.findAll({
        where: {
            role: 'seller',
            is_blocked: true
        },
        attributes: ['id', 'name', 'email', 'created_at']
    });

    return blockedSellers;
};

const getSellerStatistics = async () => {

    const query = getSellerStatisticsQuery();

    return await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT
    });

};

const getActiveSellersById = async (sellerId) => {
    const activeSeller = await User.findOne({
        where: {
            id: sellerId,
            role: 'seller',
            is_blocked: false,
            last_login: {
                [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        },
        include: [
            {
                model: Product,
                as: 'products',
                where: {
                    is_active: true,
                },
                required: true
            },
            {
                model: Order,
                as: 'orders',
                where: {
                    status: {
                        [Op.in]: ['shipped', 'completed', 'cancelled']
                    },
                    created_at: {
                        [Op.gte]: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) // Продажі за останні 6 місяців
                    }
                },
                required: false
            }
        ]
    });

    if (!activeSeller) {
        throw new Error('Seller not found');
    }

    return activeSeller;
};

const getSellerStatisticsById = async (sellerId) => {

    const query = getSellerStatisticsQuery(sellerId);

    return await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { sellerId },
    });
};

module.exports = {
    getActiveSellers,
    getNewSellers,
    getBlockedSellers,
    getSellerStatistics,
    getActiveSellersById,
    getSellerStatisticsById
};