const { Product, Subcategory } = require('../models');
const { validateProduct } = require('../validators/validators');

const getProductsByCategory = async (category) => {

    const subcategoryRecord = await Subcategory.findOne({ where: { name: category } });

    if (!subcategoryRecord) {
        return [];
    }

    const products = await Product.findAll({
        where: { subcategory_id: subcategoryRecord.id },
    });

    return products.map(validateProduct);
};

module.exports = { getProductsByCategory }
