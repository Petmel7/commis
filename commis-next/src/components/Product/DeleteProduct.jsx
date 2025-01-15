// import { useRouter } from 'next/router';
// import { deleteProduct } from '../../services/products';
// import styles from './styles/DeleteProduct.module.css';

// const DeleteProduct = ({ productId }) => {
//     const router = useRouter();

//     const handleDeleteProduct = async (e) => {
//         e.preventDefault();
//         try {
//             await deleteProduct(productId);
//             router.push('/userProducts');
//         } catch (error) {
//             console.log('handleDeleteProduct->error', error);
//         }
//     }
//     return (
//         <button className={styles.deleteProduct} onClick={handleDeleteProduct}>Видалити</button>
//     )
// }

// export default DeleteProduct;



import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { DELETE_PRODUCT } from '@/graphql/mutations/products';
import styles from './styles/DeleteProduct.module.css';

const DeleteProduct = ({ productId }) => {
    const router = useRouter();
    const [deleteProduct, { loading, error }] = useMutation(DELETE_PRODUCT, {
        onCompleted: () => {
            router.push('/userProducts');
        },
        onError: (err) => {
            console.error('Помилка видалення продукту:', err.message);
        },
    });

    const handleDeleteProduct = async (e) => {
        e.preventDefault();
        try {
            await deleteProduct({ variables: { productId } });
        } catch (err) {
            console.error('handleDeleteProduct->error:', err);
        }
    };

    return (
        <button
            className={styles.deleteProduct}
            onClick={handleDeleteProduct}
            disabled={loading}
        >
            {loading ? 'Видалення...' : 'Видалити'}
        </button>
    );
};

export default DeleteProduct;
