import { useState, useEffect } from 'react';
import { addFavorite, deleteFavorite } from '@/services/favorites';
import { useFavorites } from '@/context/FavoritesContext';
import HeartIcon from '../../../public/img/Heart.svg';
import styles from '../Product/styles/ProductCard.module.css';

const FavoriteButton = ({ product, isFavorite = false, favoriteId = null }) => {
    const [favoriteStatus, setFavoriteStatus] = useState(isFavorite);
    const [favoriteRecordId, setFavoriteRecordId] = useState(favoriteId);
    const { saveFavorite, removeFavorite, loadFavorites } = useFavorites();

    useEffect(() => {
        setFavoriteStatus(isFavorite);
        setFavoriteRecordId(favoriteId);
    }, [isFavorite, favoriteId]);

    const handleFavoriteClick = async () => {
        try {
            if (favoriteStatus && favoriteRecordId) {
                // Якщо продукт у вибраному, то видаляємо його
                await deleteFavorite(favoriteRecordId);
                setFavoriteStatus(false);
                setFavoriteRecordId(null);
                removeFavorite(favoriteRecordId); // Видаляємо з контексту
            } else {
                // Якщо продукт ще не у вибраному, додаємо його
                const response = await addFavorite(product.id);
                setFavoriteStatus(true);
                setFavoriteRecordId(response.id); // Оновлюємо новий favoriteId
                saveFavorite(response); // Додаємо в контекст
            }
            await loadFavorites(); // Оновлюємо список вибраних
        } catch (error) {
            console.error('Помилка при оновленні статусу вибраного:', error);
        }
    };

    return (
        <div className={styles.buttonContainer}>
            <HeartIcon
                className={`${styles.favoriteButton} ${favoriteStatus ? styles.favorite : ''}`}
                onClick={handleFavoriteClick}
            />
        </div>
    );
};

export default FavoriteButton;







// import { useState, useEffect } from 'react';
// import { addFavorite, deleteFavorite } from '@/services/favorites';
// import { useFavorites } from '@/context/FavoritesContext';
// import HeartIcon from '../../../public/img/Heart.svg';
// import styles from '../Product/styles/ProductCard.module.css';

// const FavoriteButton = ({ product, isFavorite = false, favoriteId = null }) => {
//     const [favoriteStatus, setFavoriteStatus] = useState(isFavorite);
//     const [favoriteRecordId, setFavoriteRecordId] = useState(favoriteId);
//     const { saveFavorite, removeFavorite, loadFavorites } = useFavorites();

//     useEffect(() => {
//         setFavoriteStatus(isFavorite);
//         setFavoriteRecordId(favoriteId);
//     }, [isFavorite, favoriteId]);

//     const handleFavoriteClick = async () => {
//         try {
//             if (favoriteStatus && favoriteRecordId) {
//                 await deleteFavorite(favoriteRecordId);
//                 setFavoriteStatus(false);
//                 setFavoriteRecordId(null);
//                 removeFavorite(favoriteRecordId);
//             } else {
//                 const response = await addFavorite(product.id);
//                 setFavoriteStatus(true);
//                 setFavoriteRecordId(response.id);
//                 saveFavorite(response);
//             }
//             await loadFavorites();
//         } catch (error) {
//             console.error('Помилка при оновленні статусу вибраного:', error);
//         }
//     };

//     return (
//         <div className={styles.buttonContainer} >
//             <HeartIcon
//                 className={
//                     `${styles.favoriteButton}
//                     ${favoriteStatus ? styles.favorite : ''}`
//                 }
//                 onClick={handleFavoriteClick}
//             />
//         </div >
//     )
// };

// export default FavoriteButton;