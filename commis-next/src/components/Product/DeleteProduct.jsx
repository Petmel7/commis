import { useRouter } from 'next/router';
import { deleteProduct } from '../../services/products';
import styles from './styles/DeleteProduct.module.css';

const DeleteProduct = ({ productId }) => {
    const router = useRouter();
    console.log('DeleteProduct->productId', productId);

    const handleDeleteProduct = async (e) => {
        e.preventDefault();
        try {
            await deleteProduct(productId);
            console.log('handleDeleteProduct->productId', productId);
            router.push('/userProducts');
        } catch (error) {
            console.log('handleDeleteProduct->error', error);
        }
    }
    return (
        <button className={styles.deleteProduct} onClick={handleDeleteProduct}>Видалити</button>
    )
}

export default DeleteProduct;