
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, RefreshToken, Product } = require('../models');
const transporter = require('../config/emailConfig');
const { generateAccessToken, generateRefreshToken, generateConfirmationCode } = require('../auth/auth');
const { updateUserLoginStatus } = require('../utils/userUtils');

const UserService = require('../services/UserService');

// Реєстрація нового користувача
const registerUser = async (req, res, next) => {
    const { name, lastname, email, password } = req.body;
    try {
        await UserService.registerUser({ name, lastname, email, password });
        res.status(201).json({ message: 'User registered successfully. Please check your email to confirm.', isRegistered: true });
    } catch (error) {
        next(error);
    }
};

// Підтвердження електронної пошти
const confirmEmail = async (req, res, next) => {
    const { token } = req.params;
    try {
        await UserService.confirmEmail(token);
        res.redirect('http://localhost:3000/login');
    } catch (error) {
        next(error);
    }
};

// Додавання номера телефону
const addPhoneNumber = async (req, res, next) => {
    const { phone } = req.body;
    try {
        await UserService.addPhoneNumber(phone, req.user.id);
        res.status(200).json({ message: 'Phone number added and confirmation email sent' });
    } catch (error) {
        next(error);
    }
};

const confirmPhoneNumber = async (req, res, next) => {
    const { confirmationcode } = req.body;

    try {
        // Викликаємо сервіс для підтвердження номера телефону
        const result = await UserService.confirmPhoneNumber(req.user.id, confirmationcode);

        res.json({ message: result.message });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Викликаємо сервіс для авторизації
        const { accessToken, refreshToken, user } = await UserService.loginUser(email, password);

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                email: user.email,
                phone: user.phone,
                last_login: user.last_login,
            },
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        next(error);
    }
};

// Логаут користувача
const logoutUser = async (req, res, next) => {
    const { token } = req.body;

    try {
        await UserService.logoutUser(token);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// Профіль користувача

const getUserProfile = async (req, res, next) => {
    try {
        const userProfile = await UserService.getUserProfile(req.user.id);
        res.json(userProfile);
    } catch (error) {
        next(error);
    }
};

// Оновлення токену доступу
const refreshToken = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const storedToken = await RefreshToken.findOne({ where: { token } });

        if (!storedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);

        storedToken.token = newRefreshToken;
        await storedToken.save();

        await deleteOldRefreshTokens();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        next(error);
    }
};

// Видалення старих Refresh Tokens
const deleteOldRefreshTokens = async () => {
    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 7); // Видалення токенів, старших за 7 днів

        const result = await RefreshToken.destroy({ where: { createdAt: { [Op.lt]: expirationDate } } });
        console.log(`Old refresh tokens deleted: ${result} tokens removed`);
    } catch (error) {
        console.error('Error deleting old refresh tokens:', error);
    }
};

module.exports = {
    registerUser,
    confirmEmail,
    addPhoneNumber,
    confirmPhoneNumber,
    loginUser,
    logoutUser,
    getUserProfile,
    refreshToken,
    deleteOldRefreshTokens
};
