const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { Product, Category, Subcategory } = require('../models');

const getProducts = async () => {
    const products = await Product.findAll();
    return products;
}

const getUserProducts = async (userId) => {
    const products = await Product.findAll({
        where: {
            user_id: userId
        }
    });
    return products;
};

const getProductById = async (id) => {
    const product = await Product.findByPk(id);

    if (!product) {
        throw { status: 404, message: 'Продукт не знайдено' };
    }

    return product;
};

const addProduct = async ({ userId, name, description, price, stock, category, subcategory, images }) => {
    // Перевірка чи існує категорія
    let categoryRecord = await Category.findOne({ where: { name: category } });
    if (!categoryRecord) {
        categoryRecord = await Category.create({ name: category });
    }

    // Перевірка чи існує підкатегорія
    let subcategoryRecord = await Subcategory.findOne({
        where: { name: subcategory, category_id: categoryRecord.id }
    });
    if (!subcategoryRecord) {
        subcategoryRecord = await Subcategory.create({
            name: subcategory,
            category_id: categoryRecord.id
        });
    }

    // Створення продукту
    const product = await Product.create({
        user_id: userId,
        name,
        description,
        price,
        stock: stock || 0,
        images: images && images.length ? images : null, // Перевіряємо наявність images
        subcategory_id: subcategoryRecord.id,
        is_active: true,
    });

    return product;
};

const updateProduct = async (id, updateData) => {
    // Знаходимо продукт за ID
    const product = await Product.findByPk(id);
    if (!product) {
        throw { status: 404, message: 'Продукт не знайдено.' };
    }

    // Оновлюємо продукт
    await product.update(updateData);

    return product; // Повертаємо оновлений продукт
};

const checkOwnershipOrAdmin = async (user, productId) => {
    const product = await Product.findByPk(productId);
    console.log('Перевірка прав доступу:', { userId: user.id, role: user.role, product });

    if (!product) {
        throw { status: 404, message: 'Продукт не знайдено' };
    }

    if (user.role !== 'superadmin' && product.user_id !== user.id) {
        throw { status: 403, message: 'Ви не можете редагувати цей продукт' };
    }

    return product;
};

const deleteProduct = async (id) => {
    // Знаходимо продукт за ID
    const product = await Product.findByPk(id);
    if (!product) {
        throw { status: 404, message: 'Продукт не знайдено.' };
    }

    // Отримуємо ID підкатегорії продукту
    const subcategoryId = product.subcategory_id;

    // Видаляємо продукт
    await product.destroy();

    // Перевіряємо, чи залишилися продукти в цій підкатегорії
    const remainingProducts = await Product.count({ where: { subcategory_id: subcategoryId } });
    if (remainingProducts === 0) {
        // Видаляємо підкатегорію, якщо продуктів більше немає
        await Subcategory.destroy({ where: { id: subcategoryId } });
    }

    return true; // Повертаємо успішний результат
};

const deleteImagesFromProduct = async (productId, indices) => {
    // Знаходимо продукт
    const product = await Product.findByPk(productId);

    if (!product) {
        throw { status: 404, message: 'Продукт не знайдено' };
    }

    // Отримуємо шляхи зображень, які потрібно видалити
    const filesToDelete = indices.map(index => product.images[index]).filter(Boolean);

    // Видаляємо файли з файлової системи
    filesToDelete.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', '..', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    });

    // Оновлюємо масив зображень у продукті
    product.images = product.images.filter((image, index) => !indices.includes(index));
    await product.save();
};

const searchProducts = async (query) => {
    if (!query) {
        throw new Error('Пошуковий запит не може бути порожнім');
    }

    // Пошук продуктів за назвою
    const products = await Product.findAll({
        where: {
            name: {
                [Op.iLike]: `%${query}%`
            }
        }
    });

    return products;
};

module.exports = {
    getProducts,
    getUserProducts,
    getProductById,
    addProduct,
    updateProduct,
    checkOwnershipOrAdmin,
    deleteProduct,
    deleteImagesFromProduct,
    searchProducts
};

