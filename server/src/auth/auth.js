const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const generateConfirmationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// const generateEmailConfirmationLink = (email) => {
//     const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     console.log('???????token', token);
//     return `http://localhost:5000/api/users/confirm/${token}`;
// };

const generateEmailConfirmationLink = (email) => {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('???????->token', token);
    return `http://localhost:3000/confirm-email?token=${token}`;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateConfirmationCode,
    generateEmailConfirmationLink
}
