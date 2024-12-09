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
                [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Активні протягом останніх 30 днів
            }
        },
        include: [
            {
                model: Product,
                as: 'products', // Використовуємо точний alias 'products' як в асоціації
                where: {
                    is_active: true,
                },
                required: true // Продавець повинен мати хоча б один активний товар
            },
            {
                model: Order,
                as: 'orders', // Використовуємо точний alias 'orders' як в асоціації
                where: {
                    status: {
                        [Op.in]: ['shipped', 'completed', 'cancelled']
                    },
                    created_at: {
                        [Op.gte]: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) // Продажі за останні 6 місяців
                    }
                },
                required: false // Продажі можуть бути відсутніми
            }
        ]
    });
    return activeSellers;
};

const getNewSellers = async (days = 7) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);

    // Отримання нових продавців
    const newSellers = await User.findAll({
        where: {
            role: 'seller',
            created_at: {
                [Op.gte]: thresholdDate, // Фільтрація за датою створення
            },
        },
        attributes: ['id', 'name', 'email', 'created_at'], // Вибір потрібних полів
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
    // Виконання запиту через Sequelize
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
                [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Активні протягом останніх 30 днів
            }
        },
        include: [
            {
                model: Product,
                as: 'products',  // Вкажіть псевдонім 'as' тут
                where: {
                    is_active: true,
                },
                required: true // Продавець повинен мати хоча б один активний товар
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
                required: false // Продажі можуть бути відсутніми, але це не обов'язково
            }
        ]
    });

    if (!activeSeller) {
        throw { status: 404, message: 'Seller not found' };
    }

    return activeSeller;
};

const getSellerStatisticsById = async (sellerId) => {

    const query = getSellerStatisticsQuery(sellerId);

    // Виконання запиту через Sequelize
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