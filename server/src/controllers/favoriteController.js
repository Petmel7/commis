
// const { createResponse } = require('../utils/response');
// const FavoriteService = require('../services/FavoriteService');

// const addFavorite = async (req, res, next) => {
//     const { productId } = req.body;
//     try {
//         await FavoriteService.addFavorite(productId, req);

//         createResponse(res, 201, 'Product added to favorites', 'success');
//     } catch (error) {
//         next(error);
//     }
// };

// const deleteFavorite = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//         await FavoriteService.deleteFavorite(id, req);

//         createResponse(res, 200, 'Product deleted successfully', 'success');
//     } catch (error) {
//         next(error);
//     }
// };

// const getFavorites = async (req, res, next) => {
//     try {
//         const response = await FavoriteService.getFavorites(req);

//         res.json(response);
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = {
//     addFavorite,
//     deleteFavorite,
//     getFavorites
// }