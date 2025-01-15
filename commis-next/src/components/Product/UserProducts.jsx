
// import { getUserProducts } from '../../services/products';
// import { baseUrl } from '../Url/baseUrl';
// import { validateArray } from '@/utils/validation';
// import useLoadingAndError from '../../hooks/useLoadingAndError';
// import BackButton from '../BackButton/BackButton';
// import NoProducts from '../NoProducts/NoProducts';
// import UserProductsCart from './UserProductsCart';
// import useFetchDataWithArg from '@/hooks/useFetchDataWithArg';

// const UserProducts = () => {
//     const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

//     const { data: rawUserProducts, loading, error } = useFetchDataWithArg(getUserProducts, accessToken);
//     const userProducts = validateArray(rawUserProducts);

//     const loadingErrorComponent = useLoadingAndError(loading, error);

//     if (loadingErrorComponent) return loadingErrorComponent;

//     if (userProducts.length === 0) {
//         return (
//             <NoProducts
//                 text='Поки що немає продуктів'
//                 buttonLink='/'
//                 buttonText='Додати продукт'
//             />
//         )
//     }

//     return (
//         <>
//             <BackButton />
//             <ul className='product-list'>
//                 {userProducts.map(product => (
//                     <li key={product.id} className='product-item'>
//                         <UserProductsCart
//                             pathProductId={`/products/userDetails/${product.id}`}
//                             productImages={`${baseUrl}${product.images[0]}`}
//                             productNames={product.name}
//                             productPrices={product.price}
//                         />
//                     </li>
//                 ))}
//             </ul>
//         </>
//     );
// };

// export default UserProducts;



import { useQuery } from '@apollo/client';
import { GET_USER_PRODUCTS } from '@/graphql/queries/products';
import { baseUrl } from '../Url/baseUrl';
import { validateArray } from '@/utils/validation';
import useLoadingAndError from '../../hooks/useLoadingAndError';
import BackButton from '../BackButton/BackButton';
import NoProducts from '../NoProducts/NoProducts';
import UserProductsCart from './UserProductsCart';

const UserProducts = () => {
    const { data, loading, error } = useQuery(GET_USER_PRODUCTS);

    const rawUserProducts = data?.userProducts || [];
    const userProducts = validateArray(rawUserProducts);

    const loadingErrorComponent = useLoadingAndError(loading, error);

    if (loadingErrorComponent) return loadingErrorComponent;

    if (userProducts.length === 0) {
        return (
            <NoProducts
                text='Поки що немає продуктів'
                buttonLink='/'
                buttonText='Додати продукт'
            />
        );
    }

    return (
        <>
            <BackButton />
            <ul className='product-list'>
                {userProducts.map((product) => (
                    <li key={product.id} className='product-item'>
                        <UserProductsCart
                            pathProductId={`/products/userDetails/${product.id}`}
                            productImages={`${baseUrl}${product.images[0]}`}
                            productNames={product.name}
                            productPrices={product.price}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
};

export default UserProducts;

