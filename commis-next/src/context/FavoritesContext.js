
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { fetchFavorites } from '@/utils/fetchFavorites';

// const FavoritesContext = createContext();

// export const useFavorites = () => useContext(FavoritesContext);

// export const FavoritesProvider = ({ children }) => {
//     const [favorites, setFavorites] = useState([]);

//     const loadFavorites = async () => {
//         const response = await fetchFavorites();
//         setFavorites(response);
//     };

//     useEffect(() => {
//         loadFavorites();
//     }, []);

//     const saveFavorite = (favorite) => {
//         setFavorites((prevFavorites) => [...prevFavorites, favorite]);
//     };

//     const removeFavorite = (favoriteId) => {
//         setFavorites((prevFavorites) => prevFavorites.filter(fav => fav.id !== favoriteId));
//     };

//     return (
//         <FavoritesContext.Provider value={{ favorites, saveFavorite, removeFavorite, loadFavorites }}>
//             {children}
//         </FavoritesContext.Provider>
//     );
// };



import React, { createContext, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FAVORITES, ADD_FAVORITE, REMOVE_FAVORITE } from '@/graphql/queries/favorites';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const { data, loading, error, refetch } = useQuery(GET_FAVORITES);

    const [addFavoriteMutation] = useMutation(ADD_FAVORITE);
    const [removeFavoriteMutation] = useMutation(REMOVE_FAVORITE);

    const favorites = data?.favorites || [];

    const loadFavorites = async () => {
        try {
            await refetch();
        } catch (err) {
            console.error('Помилка при завантаженні вибраних товарів:', err);
        }
    };

    const saveFavorite = async (productId) => {
        try {
            await addFavoriteMutation({ variables: { productId } });
            refetch();
        } catch (err) {
            console.error('Помилка при додаванні товару до вибраного:', err);
        }
    };

    const removeFavorite = async (favoriteId) => {
        try {
            await removeFavoriteMutation({ variables: { favoriteId } });
            refetch();
        } catch (err) {
            console.error('Помилка при видаленні товару з вибраного:', err);
        }
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                loading,
                error,
                saveFavorite,
                removeFavorite,
                loadFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};
