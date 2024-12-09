
// const CatalogService = require('../services/CatalogService');

// const getProductsByCategory = async (req, res, next) => {
//     const { category } = req.query;

//     try {
//         const products = await CatalogService.getProductsByCategory(category);

//         // Якщо немає продуктів, повертаємо порожній масив
//         if (!products || products.length === 0) {
//             return res.status(200).json({ status: 'success', data: [], message: 'No products found for this category' });
//         }

//         res.status(200).json({ status: 'success', data: products });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = {
//     getProductsByCategory,
// };
