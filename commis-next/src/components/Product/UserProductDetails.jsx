
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { baseUrl } from '../Url/baseUrl';
// import { useAuth } from '@/context/AuthContext';
// import useProduct from '@/hooks/useProduct';
// import useLoadingAndError from '../../hooks/useLoadingAndError';
// import DeleteProduct from './DeleteProduct';
// import BackButton from '../BackButton/BackButton';
// import Modal from '../Modal/Modal';
// import useModal from '@/hooks/useModal';
// import Slider from 'react-slick';
// import BlockedButton from '../AdminOffice/BlockedButton';
// import styles from './styles/UserProductDetails.module.css';

// const UserProductDetails = () => {
//     const router = useRouter();
//     const { productId } = router.query;
//     const { user } = useAuth();
//     const { isModalOpen, openModal, closeModal } = useModal();
//     const { product, setProduct, loading, error } = useProduct(productId);
//     const loadingErrorComponent = useLoadingAndError(loading, error);

//     if (loadingErrorComponent) return loadingErrorComponent;
//     if (!product) return <p>Продукт не знайдено</p>;

//     const settings = {
//         dots: true,
//         infinite: false,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1
//     };

//     const productsArray = Array.isArray(product) ? product : [product];

//     return (
//         <div className={styles.productDetails}>
//             <BackButton />
//             {productsArray.map(product => (
//                 <div key={product.id} className={styles.productCard}>
//                     <Slider {...settings} className={styles.slider}>
//                         {Array.isArray(product.images) && product.images.map((image, index) => (
//                             <div key={index} className={styles.imageContainer}>
//                                 <img className={styles.productImage} src={`${baseUrl}${image}`} alt={product.name} />
//                             </div>
//                         ))}
//                     </Slider>

//                     <h2 className={styles.productName}>{product.name}</h2>
//                     <p className={styles.productDescription}>{product.description}</p>
//                     <p className={styles.productPrice}>Ціна: {product.price} грн</p>

//                     <div className={styles.userProductsContainer}>
//                         <button className={styles.modalButtonOpen} onClick={openModal}>Видалити</button>
//                         <Modal show={isModalOpen} onClose={closeModal}>
//                             <div className={styles.modalContainer}>
//                                 <p className={styles.modalText}>Ви справді хочете видалити цей продукт?</p>
//                                 <DeleteProduct productId={product.id} />
//                                 <button className={styles.modalButtonClose} onClick={closeModal}>Скасувати</button>
//                             </div>
//                         </Modal>

//                         <Link href={`/products/update/${product.id}`}>
//                             <button className={styles.editButton}>Редагувати</button>
//                         </Link>

//                         {user.role === 'superadmin' &&
//                             <BlockedButton
//                                 className={styles.blockedButton}
//                                 id={productId}
//                                 isBlocked={product.is_blocked}
//                                 onStatusChange={setProduct}
//                                 type='product'
//                             />
//                         }
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default UserProductDetails;




import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_DETAILS } from '@/graphql/queries/products';
import { DELETE_PRODUCT } from '@/graphql/mutations/products';
import { baseUrl } from '../Url/baseUrl';
import { useAuth } from '@/context/AuthContext';
import useLoadingAndError from '../../hooks/useLoadingAndError';
import BackButton from '../BackButton/BackButton';
import Modal from '../Modal/Modal';
import useModal from '@/hooks/useModal';
import Slider from 'react-slick';
import BlockedButton from '../AdminOffice/BlockedButton';
import styles from './styles/UserProductDetails.module.css';

const UserProductDetails = () => {
    const router = useRouter();
    const { productId } = router.query;
    const { user } = useAuth();
    const { isModalOpen, openModal, closeModal } = useModal();

    const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
        variables: { productId },
        skip: !productId, // Запит виконується лише якщо є productId
    });

    const [deleteProductMutation] = useMutation(DELETE_PRODUCT, {
        onCompleted: () => {
            router.push('/products/userProducts'); // Перенаправлення після видалення
        },
        onError: (err) => {
            console.error('Помилка видалення продукту:', err.message);
        },
    });

    const loadingErrorComponent = useLoadingAndError(loading, error);

    if (loadingErrorComponent) return loadingErrorComponent;

    const product = data?.product;

    if (!product) return <p>Продукт не знайдено</p>;

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const handleDelete = () => {
        deleteProductMutation({ variables: { productId } });
        closeModal();
    };

    return (
        <div className={styles.productDetails}>
            <BackButton />
            <div key={product.id} className={styles.productCard}>
                <Slider {...settings} className={styles.slider}>
                    {Array.isArray(product.images) && product.images.map((image, index) => (
                        <div key={index} className={styles.imageContainer}>
                            <img
                                className={styles.productImage}
                                src={`${baseUrl}${image}`}
                                alt={product.name}
                            />
                        </div>
                    ))}
                </Slider>

                <h2 className={styles.productName}>{product.name}</h2>
                <p className={styles.productDescription}>{product.description}</p>
                <p className={styles.productPrice}>Ціна: {product.price} грн</p>

                <div className={styles.userProductsContainer}>
                    <button className={styles.modalButtonOpen} onClick={openModal}>Видалити</button>
                    <Modal show={isModalOpen} onClose={closeModal}>
                        <div className={styles.modalContainer}>
                            <p className={styles.modalText}>Ви справді хочете видалити цей продукт?</p>
                            <button className={styles.authButton} onClick={handleDelete}>
                                Видалити
                            </button>
                            <button className={styles.modalButtonClose} onClick={closeModal}>
                                Скасувати
                            </button>
                        </div>
                    </Modal>

                    <Link href={`/products/update/${product.id}`}>
                        <button className={styles.editButton}>Редагувати</button>
                    </Link>

                    {user.role === 'superadmin' && (
                        <BlockedButton
                            className={styles.blockedButton}
                            id={productId}
                            isBlocked={product.isBlocked}
                            onStatusChange={(updatedProduct) => {
                                product.isBlocked = updatedProduct.isBlocked;
                            }}
                            type='product'
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProductDetails;
