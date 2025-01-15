
// import React from 'react';
// import ProductCard from './ProductCard';
// import { useFavorites } from '@/context/FavoritesContext';
// import { isProductFavorite } from '@/utils/favorites';

// const ProductList = ({ products }) => {
//     const { favorites } = useFavorites();

//     return (
//         <ul className='product-list'>
//             {products.map(product => {
//                 const { isFavorite, favoriteId } = isProductFavorite(product.id, favorites);
//                 return (
//                     <ProductCard
//                         key={product.id}
//                         product={product}
//                         isFavorite={isFavorite}
//                         favoriteId={favoriteId}
//                     />
//                 );
//             })}
//         </ul>
//     );
// };

// export default ProductList;





import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FAVORITE_IDS } from '@/graphql/queries/favorites';
import ProductCard from './ProductCard';
import { isProductFavorite } from '@/utils/favorites';

const ProductList = ({ products }) => {
    const { data, loading, error } = useQuery(GET_FAVORITE_IDS);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error.message}</p>;

    const favorites = data?.favorites || [];

    return (
        <ul className='product-list'>
            {products.map(product => {
                const { isFavorite, favoriteId } = isProductFavorite(product.id, favorites);
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
