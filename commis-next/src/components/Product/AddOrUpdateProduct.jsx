
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { addProduct, updateProduct, getProductById } from '../../services/products';
// import ProductForm from './ProductForm';
// import BackButton from '../BackButton/BackButton';
// import styles from './styles/ProductForm.module.css';

// const AddOrUpdateProduct = () => {
//     const router = useRouter();
//     const { productId } = router.query;
//     const [initialData, setInitialData] = useState({});

//     const fetchProduct = async () => {
//         const productData = await getProductById(productId);
//         setInitialData(productData);
//     };

//     useEffect(() => {
//         if (productId) {
//             fetchProduct();
//         }
//     }, [productId]);

//     const handleSubmit = async (productData) => {
//         let response;
//         if (productId) {
//             response = await updateProduct(productId, productData);
//         } else {
//             response = await addProduct(productData);
//         }
//         router.push('/userProducts');
//         return response;
//     };

//     return (
//         <>
//             <BackButton />
//             <div className={styles.container}>
//                 <ProductForm initialData={initialData} fetchProduct={fetchProduct} onSubmit={handleSubmit} />
//             </div>
//         </>
//     );

// };

// export default AddOrUpdateProduct;





import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_BY_ID, CREATE_OR_UPDATE_PRODUCT } from '@/graphql/queries/products';
import ProductForm from './ProductForm';
import BackButton from '../BackButton/BackButton';
import styles from './styles/ProductForm.module.css';

const AddOrUpdateProduct = () => {
    const router = useRouter();
    const { productId } = router.query;

    // Запит для отримання продукту
    const { data, loading, error, refetch } = useQuery(GET_PRODUCT_BY_ID, {
        variables: { productId },
        skip: !productId, // Запит виконується лише якщо є productId
    });

    // Мутація для створення або оновлення продукту
    const [createOrUpdateProduct] = useMutation(CREATE_OR_UPDATE_PRODUCT, {
        onCompleted: () => {
            router.push('/userProducts');
        },
        onError: (err) => {
            console.error('Помилка під час додавання або оновлення продукту:', err.message);
        },
    });

    // Обробка даних продукту
    const initialData = data?.product || {};

    // Функція обробки відправки форми
    const handleSubmit = async (productData) => {
        try {
            await createOrUpdateProduct({
                variables: {
                    id: productId || null,
                    ...productData,
                },
            });
        } catch (err) {
            console.error('handleSubmit->error:', err);
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error.message}</p>;

    return (
        <>
            <BackButton />
            <div className={styles.container}>
                <ProductForm
                    initialData={initialData}
                    fetchProduct={refetch}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
};

export default AddOrUpdateProduct;
