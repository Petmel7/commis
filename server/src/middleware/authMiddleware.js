
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findByPk(decoded.id, {
                attributes: ['id', 'name', 'email', 'role', 'is_blocked']
            });

            if (!user) {
                return res.status(401).json({ message: 'Неавторизовано, користувача не знайдено' });
            }

            if (user.is_blocked) {
                return res.status(403).json({ message: 'Користувача заблоковано' });
            }

            req.user = user; // Додаємо користувача до об'єкта запиту
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Неавторизовано, помилка токена' });
        }
    } else {
        res.status(401).json({ message: 'Неавторизовано, відсутній токен' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Недостатньо прав для виконання цієї дії' });
        }
        next();
    };
};

module.exports = { protect, authorize };