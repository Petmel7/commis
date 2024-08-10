
import { deleteImage } from '../../services/products';
import DeleteIcon from '../../../public/img/delete.svg';
import styles from './styles/ProductForm.module.css';

const DeleteImage = ({ productId, index, fetchProduct }) => {

    const handleDeleteImage = async (e) => {
        e.preventDefault();
        const indices = [index];
        console.log('handleDeleteImage->indices', indices);
        try {
            await deleteImage(productId, indices);
            fetchProduct();
            console.log('DeleteImage->productId-indices', productId, indices);
        } catch (error) {
            console.log('handleDeleteImage->error', error);
        }
    }

    return (
        <button className={styles.deleteImageForm} onClick={handleDeleteImage}>
            <DeleteIcon />
        </button>
    )
}

export default DeleteImage;