const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/emailConfig');
const { User, RefreshToken, Product } = require('../models');
const { generateAccessToken, generateRefreshToken, generateConfirmationCode, generateEmailConfirmationLink } = require('../auth/auth');
const { updateUserLoginStatus } = require('../utils/userUtils');
const { sendEmailConfirmationLink } = require('../utils/emailUtils');

const getAllUsers = async () => {
    const users = await User.findAll();
    return users;
}

const getUserById = async (id) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw { status: 404, message: 'User not found' };
    }

    return user;
}

const registerUser = async ({ name, lastname, email, password }) => {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw new Error('User already exists', 'USER_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, lastname, email, password: hashedPassword });

    const url = generateEmailConfirmationLink(email);

    await sendEmailConfirmationLink(email, url);

    return 'User registered successfully. Please check your email for confirmation.';
};

const confirmEmail = async (token) => {
    try {
        // Декодуємо токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.email) {
            throw new Error("Токен не містить email");
        }

        // Оновлення статусу підтвердження email
        await User.update(
            { emailconfirmed: true },
            { where: { email: decoded.email } }
        );
        return "Email підтверджено успішно";
    } catch (err) {
        // Помилка токена
        console.error("Token verification error:", err.message);
        throw new Error("Невалідний або протермінований токен");
    }
};

const addPhoneNumber = async (phone, userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const confirmationCode = generateConfirmationCode();
    await user.update({ phone, confirmationcode: confirmationCode });

    await sendPhoneConfirmationEmail(user.email, confirmationCode);

    // Повертаємо підтвердження
    return `Phone number ${phone} added successfully and confirmation email sent.`;
}

const confirmPhoneNumber = async (userId, confirmationcode) => {
    try {
        // Знаходимо користувача за ID
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('Користувача не знайдено');
        }

        // Перевіряємо код підтвердження
        if (String(user.confirmationcode) !== String(confirmationcode)) {
            throw new Error('Невірний код підтвердження.');
        }

        // Оновлюємо статус підтвердження телефону
        await user.update({ phoneconfirmed: true, confirmationcode: null });

        return 'Номер телефону успішно підтверджено.';
    } catch (error) {
        console.error('Error confirming phone number:', error);
        throw error; // Перенаправлення помилки GraphQL
    }
};

const loginUser = async (email, password) => {
    // Перевірка наявності користувача
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw { status: 400, message: 'Невірні облікові дані' };
    }

    // Перевірка пароля
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw { status: 400, message: 'Невірні облікові дані' };
    }

    // Оновлюємо дату останнього входу
    await updateUserLoginStatus(user);

    // Генеруємо токени
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Видаляємо старий refresh-токен (за бажанням)
    await RefreshToken.destroy({ where: { user_id: user.id } });

    // Зберігаємо новий refresh-токен
    await RefreshToken.create({ user_id: user.id, token: refreshToken });

    // Повертаємо результати
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};

const logoutUser = async (token) => {

    const deletedToken = await RefreshToken.destroy({ where: { token } });

    if (!deletedToken) {
        throw new Error("Невірні облікові дані");
    }
    return "Logout успішний";
}

const getUserProfile = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: [
                'id',
                'name',
                'lastname',
                'email',
                'emailconfirmed',
                'phone',
                'phoneconfirmed',
                'confirmationcode',
                'googleid',
                'role',
                'is_blocked'
            ]
        });

        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        // Return user profile with additional fields
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            emailConfirmed: user.emailconfirmed,
            phone: user.phone,
            phoneConfirmed: user.phoneconfirmed,
            googleRegistered: !!user.googleid,
            role: user.role,
            isBlocked: user.is_blocked
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error; // Rethrow error for GraphQL to handle
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

const updateUserRoleIfNecessary = async (user) => {
    // Якщо користувач — superadmin, ніяких змін не потрібно
    if (user.role === 'superadmin') return;

    // Оновлюємо роль користувача на 'seller', якщо це необхідно
    const [updatedRows] = await User.update({ role: 'seller' }, { where: { id: user.id } });

    if (updatedRows === 0) {
        throw new Error('User not found or role not updated');
    }
};

const updateUserRoleIfNoProducts = async (userId) => {
    // Отримуємо користувача, щоб перевірити його роль
    const user = await User.findByPk(userId, { attributes: ['role'] });

    if (!user) {
        throw new Error('Користувача не знайдено');
    }

    // Ігноруємо зміну ролі для адміністраторів
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
