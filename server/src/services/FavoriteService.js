const { Favorite, Product } = require('../models');
const { validateFavoriteData } = require('../validators/validators');

const getFavorites = async (user) => {
    if (!user) {
        throw new Error('Not authenticated');
    }

    const favorites = await Favorite.findAll({
        where: { user_id: user.id },
        include: [
            {
                model: Product,
                as: 'Product',
                attributes: ['id', 'name', 'description', 'price', 'stock', 'images', 'user_id']
            }
        ]
    });

    return favorites.map(favorite => ({
        id: favorite.id,
        product_id: favorite.product_id,
        product: favorite.Product,
    }));
};

const addFavorite = async (productId, user) => {
    if (!user) {
        throw new Error('Not authenticated');
    }

    validateFavoriteData(productId);

    const [favorite, created] = await Favorite.findOrCreate({
        where: { user_id: user.id, product_id: productId },
    });

    if (!created) {
        throw new Error('The product has already been added to your favorites');
    }
};

const deleteFavorite = async (id, user) => {
    if (!user) {
        throw new Error('Not authenticated');
    }

    const favorite = await Favorite.findByPk(id);
    if (!favorite) {
        throw new Error('Favorite not found');
    }
    if (favorite.user_id !== user.id) {
        throw new Error('Not authorized to delete this favorite');
    }

    await favorite.destroy();
};

module.exports = {
    addFavorite,
    deleteFavorite,
    getFavorites
};
