
// import { deleteImage } from '../../services/products';
// import DeleteIcon from '../../../public/img/delete.svg';
// import styles from './styles/ProductForm.module.css';

// const DeleteImage = ({ productId, index, fetchProduct }) => {

//     const handleDeleteImage = async (e) => {
//         e.preventDefault();
//         const indices = [index];
//         try {
//             await deleteImage(productId, indices);
//             fetchProduct();
//         } catch (error) {
//             console.log('handleDeleteImage->error', error);
//         }
//     }

//     return (
//         <button className={styles.deleteImageForm} onClick={handleDeleteImage}>
//             <DeleteIcon />
//         </button>
//     )
// }

// export default DeleteImage;



import { useMutation } from '@apollo/client';
import { DELETE_IMAGE } from '@/graphql/mutations/products';
import DeleteIcon from '../../../public/img/delete.svg';
import styles from './styles/ProductForm.module.css';

const DeleteImage = ({ productId, index, fetchProduct }) => {
    const [deleteImage, { loading, error }] = useMutation(DELETE_IMAGE, {
        onCompleted: () => {
            if (fetchProduct) fetchProduct(); // Оновлюємо продукт після видалення
        },
        onError: (err) => {
            console.error('Помилка видалення зображення:', err.message);
        },
    });

    const handleDeleteImage = async (e) => {
        e.preventDefault();
        try {
            await deleteImage({
                variables: {
                    productId,
                    indices: [index], // Передаємо індекс зображення для видалення
                },
            });
        } catch (err) {
            console.error('handleDeleteImage->error:', err);
        }
    };

    return (
        <button
            className={styles.deleteImageForm}
            onClick={handleDeleteImage}
            disabled={loading}
            title={error ? 'Помилка видалення' : 'Видалити зображення'}
        >
            {loading ? '...' : <DeleteIcon />}
        </button>
    );
};

export default DeleteImage;
