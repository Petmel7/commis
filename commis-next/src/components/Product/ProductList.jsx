
import React from 'react';
import ProductCard from './ProductCard';
import { useFavorites } from '@/context/FavoritesContext';

const ProductList = ({ products }) => {
    const { favorites } = useFavorites();

    const isProductFavorite = (productId) => {
        if (Array.isArray(favorites)) {
            const favorite = favorites.find(fav => fav.product_id === productId);
            return favorite ? { isFavorite: true, favoriteId: favorite.id } : { isFavorite: false, favoriteId: null };
        }
        return { isFavorite: false, favoriteId: null };
    };

    return (
        <ul className='product-list'>
            {products.map(product => {
                const { isFavorite, favoriteId } = isProductFavorite(product.id);
                return (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={isFavorite}
                        favoriteId={favoriteId}
                    />
                );
            })}
        </ul>
    );
};

export default ProductList;

