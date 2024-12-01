
// const path = require('path');
// const ProductService = require('../services/ProductService');
// const UserService = require('../services/UserService');

// // Отримати всі продукти
// const getProducts = async (req, res, next) => {
//     try {
//         const products = await ProductService.getProducts();
//         res.json(products);
//     } catch (error) {
//         next(error);
//     }
// };

// // Отримати продукти поточного користувача
// const getUserProducts = async (req, res, next) => {
//     try {
//         const products = await ProductService.getUserProducts({ where: { user_id: req.user.id } });
//         res.json(products);
//     } catch (error) {
//         next(error);
//     }
// };

// // Отримати продукт за ID
// const getProductById = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//         const product = await ProductService.getProductById(id);
//         res.json(product);
//     } catch (error) {
//         next(error);
//     }
// };

// const addProduct = async (req, res, next) => {
//     const { name, description, price, stock, category, subcategory } = req.body;
//     const images = req.files
//         ? req.files.map(file => file.path.replace(`${path.join(__dirname, '../../')}`, ''))
//         : [];

//     try {
//         // Створюємо продукт через сервіс
//         const product = await ProductService.addProduct({
//             userId: req.user.id,
//             name,
//             description,
//             price,
//             stock,
//             category,
//             subcategory,
//             images
//         });

//         // Оновлюємо роль користувача через сервіс, якщо це необхідно
//         await UserService.updateUserRoleIfNecessary(req.user);

//         res.status(201).json({ message: 'Product added successfully', product });
//     } catch (error) {
//         next(error);
//     }
// };

// // Оновити продукт
// const updateProduct = async (req, res, next) => {
//     const { id } = req.params;
//     const { name, description, price, stock } = req.body;
//     const images = req.files
//         ? req.files.map(file => file.path.replace(`${path.join(__dirname, '../../')}`, ''))
//         : null;

//     try {
//         const updateData = { name, description, price, stock };
//         if (images) updateData.images = images;

//         // Перевіряємо права доступу та оновлюємо продукт через сервіс
//         await ProductService.checkOwnershipOrAdmin(req.user, id);
//         const updatedProduct = await ProductService.updateProduct(id, updateData);

//         res.json({ message: 'Продукт успішно оновлено', product: updatedProduct });
//     } catch (error) {
//         if (error.status) {
//             return res.status(error.status).json({ message: error.message });
//         }
//         next(error);
//     }
// };

// const deleteProduct = async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         // Отримуємо продукт
//         const product = await ProductService.findProductById(id);

//         // Перевіряємо права доступу
//         await ProductService.checkOwnershipOrAdmin(req.user, product.id);

//         // Видаляємо продукт та пов'язані підкатегорії
//         await ProductService.deleteProduct(product);

//         // Перевіряємо та оновлюємо роль користувача
//         await ProductService.updateUserRoleIfNoProducts(req.user.id);

//         res.json({ message: 'Продукт і пов’язана підкатегорія успішно видалені' });
//     } catch (error) {
//         if (error.status) {
//             return res.status(error.status).json({ message: error.message });
//         }
//         next(error);
//     }
// };

// const deleteImage = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { indices } = req.body;

//         // Викликаємо сервіс для видалення зображень
//         await ProductService.deleteImagesFromProduct(id, indices);

//         res.send('Images deleted successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// const searchProducts = async (req, res, next) => {
//     try {
//         const { query } = req.query;

//         const products = await ProductService.searchProducts(query);

//         res.json({ products });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = {
//     getProducts,
//     getUserProducts,
//     getProductById,
//     addProduct,
//     updateProduct,
//     deleteProduct,
//     deleteImage,
//     searchProducts
// };
