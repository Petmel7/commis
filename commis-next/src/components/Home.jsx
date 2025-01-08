
import { gql, useQuery } from '@apollo/client';
import ProductList from './Product/ProductList';
import SellerButton from './User/SellerButton';
import useLoadingAndError from '../hooks/useLoadingAndError';
import { GET_PRODUCTS } from '@/graphql/queries/product';

const Home = () => {
    const { loading, error, data } = useQuery(GET_PRODUCTS);
    const products = data?.products || [];

    const loadingErrorComponent = useLoadingAndError(loading, error);

    if (loadingErrorComponent) return loadingErrorComponent;

    return (
        <>
            <SellerButton />
            <ProductList products={products} />
        </>
    );
};

export default Home;
