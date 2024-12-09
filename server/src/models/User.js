
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailconfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneconfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmationcode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    googleid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'buyer'
    },
    is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'users'
});

module.exports = User;




