
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import styles from './styles/Auth.module.css';

// const SellerButton = () => {
//     const { isRegistered, isGoogleRegistered } = useAuth();

//     return (
//         <div>
//             {!isRegistered && !isGoogleRegistered ? (
//                 <div className={styles.authButtonConteaner}>
//                     <span className={styles.authText}>Хочете стати продавцем?</span>
//                     <Link href='/register'><button className={styles.authButton}>Так</button></Link>
//                 </div>
//             ) : (
//                 ''
//             )}
//         </div>
//     );
// };

// export default SellerButton;


import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_USER_STATUS } from '@/graphql/queries/user';
import styles from './styles/Auth.module.css';

const SellerButton = () => {
    const { data, loading, error } = useQuery(GET_USER_STATUS);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error.message}</p>;

    const { isRegistered, isGoogleRegistered } = data?.user || {};

    return (
        <div>
            {!isRegistered && !isGoogleRegistered ? (
                <div className={styles.authButtonConteaner}>
                    <span className={styles.authText}>Хочете стати продавцем?</span>
                    <Link href='/register'>
                        <button className={styles.authButton}>Так</button>
                    </Link>
                </div>
            ) : null}
        </div>
    );
};

export default SellerButton;

