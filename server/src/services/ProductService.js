const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { Product, Category, Subcategory } = require('../models');

const getAllProducts = async () => {
    const products = await Product.findAll();

    if (!products) {
        throw new Error('Products not found');
    }

    return products;
}

const getProductById = async (id) => {
    const product = await Product.findByPk(id);

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};

const getSellerProducts = async (userId) => {
    const products = await Product.findAll({
        where: {
            user_id: userId
        }
    });
    return products;
};

const addProduct = async (userId, name, description, price, stock, category, subcategory, images) => {

    let categoryRecord = await Category.findOne({ where: { name: category } });
    if (!categoryRecord) {
        categoryRecord = await Category.create({ name: category });
    }

    let subcategoryRecord = await Subcategory.findOne({
        where: { name: subcategory, category_id: categoryRecord.id }
    });
    if (!subcategoryRecord) {
        subcategoryRecord = await Subcategory.create({
            name: subcategory,
            category_id: categoryRecord.id
        });
    }

    const product = await Product.create({
        user_id: userId,
        name,
        description,
        price,
        stock: stock || 0,
        images: images && images.length ? images : null,
        subcategory_id: subcategoryRecord.id,
        is_active: true,
    });

    return product;
};

const updateProduct = async (id, updateData) => {
    const product = await Product.findByPk(id);
    if (!product) {
        throw new Error('Product not found');
    }

    await product.update(updateData);

    return product;
};

const checkOwnershipOrAdmin = async (user, productId) => {
    const product = await Product.findByPk(productId);
    console.log('Checking access rights:', { userId: user.id, role: user.role, product });

    if (!product) {
        throw new Error('Product not found');
    }

    if (user.role !== 'superadmin' && product.user_id !== user.id) {
        throw new Error('You cannot edit this product');
    }

    return product;
};

const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) {
        throw new Error('Product not found');
    }

    const subcategoryId = product.subcategory_id;

    await product.destroy();

    const remainingProducts = await Product.count({ where: { subcategory_id: subcategoryId } });
    if (remainingProducts === 0) {
        await Subcategory.destroy({ where: { id: subcategoryId } });
    }

    return true;
};

const deleteImagesFromProduct = async (productId, indices) => {
    const product = await Product.findByPk(productId);

    if (!product) {
        throw new Error('Product not found');
    }

    const filesToDelete = indices.map(index => product.images[index]).filter(Boolean);

    filesToDelete.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', '..', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    });

    product.images = product.images.filter((image, index) => !indices.includes(index));
    await product.save();
};

const searchProducts = async (query) => {
    if (!query) {
        throw new Error('The search query cannot be empty');
    }

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
    getAllProducts,
    getProductById,
    getSellerProducts,
    addProduct,
    updateProduct,
    checkOwnershipOrAdmin,
    deleteProduct,
    deleteImagesFromProduct,
    searchProducts
};

