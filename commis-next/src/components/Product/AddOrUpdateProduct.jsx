
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductForm from './ProductForm';
import { addProduct, updateProduct, getProductById } from '../../services/products';
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
        if (productId) {
            await updateProduct(productId, productData);
        } else {
            await addProduct(productData);
        }
        router.push('/userProducts');
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
