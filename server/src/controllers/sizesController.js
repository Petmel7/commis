
// const SizesService = require('../services/SizesService');

// // Отримати всі доступні розміри для певного продукту
// const getSizesByProductId = async (req, res, next) => {
//     const { productId } = req.params;

//     try {
//         const productSizes = await SizesService.getSizesByProductId(productId);

//         res.status(200).json(productSizes);
//     } catch (error) {
//         next(error);
//     }
// };

// const addSizeToProduct = async (req, res, next) => {
//     const { productId } = req.params;
//     const { sizes } = req.body; // Приймаємо масив розмірів

//     try {
//         await SizesService.addSizeToProduct(productId, sizes);

//         res.status(201).json({ message: 'Sizes added successfully' });
//     } catch (error) {
//         next(error);
//     }
// };

// // Видалити розмір для продукту
// const removeSizeFromProduct = async (req, res, next) => {
//     const { productId, sizeId } = req.params;

//     try {
//         await SizesService.removeSizeFromProduct(productId, sizeId);

//         res.status(200).json({ message: 'Size removed successfully' });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = {
//     getSizesByProductId,
//     addSizeToProduct,
//     removeSizeFromProduct
// };
