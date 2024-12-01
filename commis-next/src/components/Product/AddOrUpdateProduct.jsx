
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { addProduct, updateProduct, getProductById } from '../../services/products';
import ProductForm from './ProductForm';
import BackButton from '../BackButton/BackButton';
import styles from './styles/ProductForm.module.css';

const AddOrUpdateProduct = () => {
    const router = useRouter();
    const { productId } = router.query;
    const [initialData, setInitialData] = useState({});

    const fetchProduct = async () => {
        const productData = await getProductById(productId);
        setInitialData(productData);
    };

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleSubmit = async (productData) => {
        let response;
        if (productId) {
            response = await updateProduct(productId, productData);
        } else {
            response = await addProduct(productData);
        }
        router.push('/userProducts');
        return response;
    };

    return (
        <>
            <BackButton />
            <div className={styles.container}>
                <ProductForm initialData={initialData} fetchProduct={fetchProduct} onSubmit={handleSubmit} />
            </div>
        </>
    );

};

export default AddOrUpdateProduct;

