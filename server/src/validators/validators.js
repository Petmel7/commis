const Joi = require('joi');

// Схема для валідації продуктів
const productSchema = Joi.object({
    id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().integer().required(),
    images: Joi.array().items(Joi.string()).required(),
    subcategory_id: Joi.number().integer().required(),
    is_active: Joi.boolean().default(true),
    is_blocked: Joi.boolean().allow(null),
    createdAt: Joi.date().allow(null),
    updatedAt: Joi.date().allow(null),
    subcategory: Joi.object().allow(null),
});

// Схема для валідації додавання до улюблених
const addFavoriteSchema = Joi.object({
    productId: Joi.number().integer().required().messages({
        'number.base': '"productId" повинно бути числом',
        'any.required': '"productId" обов’язкове для заповнення'
    })
});

const validateProduct = (product) => {
    const { error, value } = productSchema.validate(product.dataValues || product);
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
    }
    return value;
};

const validateFavoriteData = (productId) => {
    const { error } = addFavoriteSchema.validate({ productId });
    if (error) {
        throw { status: 400, message: error.details[0].message, type: 'validation_error' };
    }
};

const validateTimestamps = (entities) => {
    if (Array.isArray(entities)) {
        entities.forEach((entity) => {
            if (!entity.createdat) entity.createdat = new Date().toISOString();
            if (!entity.updatedat) entity.updatedat = new Date().toISOString();
        });
    } else {
        if (!entities.createdat) entities.createdat = new Date().toISOString();
        if (!entities.updatedat) entities.updatedat = new Date().toISOString();
    }
};

module.exports = {
    productSchema,
    addFavoriteSchema,
    validateProduct,
    validateFavoriteData,
    validateTimestamps
};
