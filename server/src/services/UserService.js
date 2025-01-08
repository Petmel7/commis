const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, RefreshToken, Product } = require('../models');
const { generateAccessToken, generateRefreshToken, generateConfirmationCode, generateEmailConfirmationLink } = require('../auth/auth');
const { updateUserLoginStatus } = require('../utils/userUtils');
const { sendEmailConfirmationLink } = require('../utils/emailUtils');
const { sendPhoneConfirmationEmail } = require('../utils/emailUtils');

const getAllUsers = async () => {
    const users = await User.findAll();
    return users;
}

const getUserById = async (id) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

const registerUser = async ({ name, lastname, email, password }) => {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw new Error('User already exists', 'USER_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, lastname, email, password: hashedPassword });

    try {
        const url = generateEmailConfirmationLink(email);
        await sendEmailConfirmationLink(email, url);
    } catch (mailError) {
        await User.destroy({ where: { email } }); // Rollback
        throw new Error('Failed to send email', 'EMAIL_ERROR');
    }

    return 'User registered successfully. Please check your email for confirmation.';
};

const confirmEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.email) {
            throw new Error("The token does not contain an email");
        }

        await User.update(
            { email_confirmed: true },
            { where: { email: decoded.email } }
        );
        return "Email confirmed successfully";
    } catch (err) {
        console.error("Token verification error:", err.message);
        throw new Error("Invalid or expired token");
    }
};

const addPhoneNumber = async (phone, userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const confirmationCode = generateConfirmationCode();
    await user.update({ phone, confirmation_code: confirmationCode });

    await sendPhoneConfirmationEmail(user.email, confirmationCode);

    return `Phone number ${phone} added successfully and confirmation email sent.`;
}

const confirmPhoneNumber = async (userId, confirmationcode) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('No user found');
        }

        if (String(user.confirmation_code) !== String(confirmationcode)) {
            throw new Error('Invalid verification code.');
        }

        await user.update({ phone_confirmed: true, confirmation_code: null });

        return 'The phone number has been successfully verified.';
    } catch (error) {
        console.error('Error confirming phone number:', error);
        throw error;
    }
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error("Invalid credentials");
    }

    await updateUserLoginStatus(user);

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    await RefreshToken.destroy({ where: { user_id: user.id } });

    await RefreshToken.create({ user_id: user.id, token: refreshToken });

    const userToken = {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
    return userToken;

    // return {
    //     accessToken,
    //     refreshToken,
    //     user: {
    //         id: user.id,
    //         name: user.name,
    //         email: user.email,
    //     }
    // }
};

const logoutUser = async (token) => {

    const deletedToken = await RefreshToken.destroy({ where: { token } });

    if (!deletedToken) {
        throw new Error("Invalid credentials");
    }
    return "Logout successful";
}

const getUserProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: [
                'id',
                'name',
                'last_name',
                'email',
                'email_confirmed',
                'phone',
                'phone_confirmed',
                'confirmation_code',
                'google_id',
                'role',
                'is_blocked'
            ]
        });

        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        return {
            id: user.id,
            name: user.name,
            lastname: user.last_name,
            email: user.email,
            emailConfirmed: user.email_confirmed,
            phone: user.phone,
            phoneConfirmed: user.phone_confirmed,
            googleRegistered: !!user.google_id,
            role: user.role,
            isBlocked: user.is_blocked
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

const refreshToken = async (token) => {
    if (!token) {
        throw new Error('Invalid token');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const storedToken = await RefreshToken.findOne({ where: { token } });

    if (!storedToken) {
        throw new Error('Invalid token');
    }

    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    storedToken.token = newRefreshToken;
    await storedToken.save();

    await deleteOldRefreshTokens();

    return { newAccessToken, newRefreshToken };
}

const deleteOldRefreshTokens = async () => {
    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 7);

        const result = await RefreshToken.destroy({ where: { createdAt: { [Op.lt]: expirationDate } } });
        console.log(`Old refresh tokens deleted: ${result} tokens removed`);
    } catch (error) {
        console.error('Error deleting old refresh tokens:', error);
    }
};

const updateUserRoleIfNecessary = async (user) => {
    if (user.role === 'superadmin') return;

    const [updatedRows] = await User.update({ role: 'seller' }, { where: { id: user.id } });

    if (updatedRows === 0) {
        throw new Error('User not found or role not updated');
    }
};

const updateUserRoleIfNoProducts = async (userId) => {
    const user = await User.findByPk(userId, { attributes: ['role'] });

    if (!user) {
        throw new Error('No user found');
    }

    if (user.role === 'superadmin') {
        return;
    }
    const remainingUserProducts = await Product.count({ where: { user_id: userId } });
    if (remainingUserProducts === 0) {
        await User.update({ role: 'buyer' }, { where: { id: userId } });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
    confirmEmail,
    addPhoneNumber,
    confirmPhoneNumber,
    loginUser,
    logoutUser,
    getUserProfile,
    refreshToken,
    updateUserRoleIfNecessary,
    updateUserRoleIfNoProducts
};
