const transporter = require('../config/emailConfig');

// Функція для надсилання електронної пошти
const sendOrderEmail = async (userEmail, orderId, orderDetails, total) => {
    const baseURL = 'http://localhost:5000/uploads';
    await transporter.sendMail({
        to: userEmail,
        subject: `Ваше замовлення ${orderId} отримано продавцями`,
        html: `
            <h1>Деталі замовлення</h1>
            <table>
                <tr>
                    <th>Фото</th>
                    <th>Назва товару</th>
                    <th>Кількість</th>
                    <th>Ціна</th>
                    <th>Продавець</th>
                </tr>
                ${orderDetails}
            </table>
            <p>Загальна сума: ${total}</p>
        `
    });
};

const sendEmailConfirmationLink = async (email, url) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'Confirm your email',
            html: `<a href="${url}">Click here to confirm your email address.</a>`,
        });
    } catch (mailError) {
        throw new Error('Failed to send email', 'EMAIL_ERROR');
    }
};

const sendPhoneConfirmationEmail = async (email, confirmationCode) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'Confirm your phone number',
            html: `<div>Your phone confirmation code: ${confirmationCode}</div>`,
        });
    } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        throw new Error('Failed to send confirmation email');
    }
}

module.exports = {
    sendOrderEmail,
    sendEmailConfirmationLink,
    sendPhoneConfirmationEmail
};