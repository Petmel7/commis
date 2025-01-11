// import { useState } from 'react';
// import { googleAuth } from '@/services/auth';
// import GoogleIcon from '../../../public/img/google.svg';
// import useLoadingAndError from '../../hooks/useLoadingAndError';
// import styles from './styles/GoogleAuth.module.css';

// const GoogleAuth = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const loadingErrorComponent = useLoadingAndError(loading, error);

//     const handleGoogleSignIn = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         try {
//             await googleAuth();
//             setLoading(false);
//         } catch (error) {
//             console.error('Помилка автентифікації через Google', error);
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     if (loadingErrorComponent) return loadingErrorComponent;

//     return (
//         <div className={styles.googleAuthContainer}>
//             <button className={styles.googleAuthButton} onClick={handleGoogleSignIn}>
//                 <div className={styles.googleAuthContent}>
//                     <GoogleIcon className={styles.googleIcon} />
//                     <p>Увійти через Google</p>
//                 </div>
//             </button>
//         </div>
//     );
// };

// export default GoogleAuth;



import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GOOGLE_AUTH } from '@/graphql/mutations/auth';
import GoogleIcon from '../../../public/img/google.svg';
import useLoadingAndError from '../../hooks/useLoadingAndError';
import styles from './styles/GoogleAuth.module.css';

const GoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [googleAuthMutation] = useMutation(GOOGLE_AUTH);

    const loadingErrorComponent = useLoadingAndError(loading, error);

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Отримання Google ID токена (замініть на відповідну логіку)
            const idToken = await getGoogleIdToken(); // Логіка для отримання токена Google

            const { data } = await googleAuthMutation({
                variables: { idToken },
            });

            if (data.googleAuth) {
                localStorage.setItem('accessToken', data.googleAuth.accessToken);
                localStorage.setItem('refreshToken', data.googleAuth.refreshToken);
                console.log('Користувач увійшов через Google:', data.googleAuth.user);
            }

            setLoading(false);
        } catch (err) {
            console.error('Помилка автентифікації через Google', err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (loadingErrorComponent) return loadingErrorComponent;

    return (
        <div className={styles.googleAuthContainer}>
            <button className={styles.googleAuthButton} onClick={handleGoogleSignIn}>
                <div className={styles.googleAuthContent}>
                    <GoogleIcon className={styles.googleIcon} />
                    <p>Увійти через Google</p>
                </div>
            </button>
        </div>
    );
};

export default GoogleAuth;

async function getGoogleIdToken() {
    // Логіка для ініціалізації Google Sign-In і отримання ID токена
    return new Promise((resolve, reject) => {
        // Приклад із Google API (gapi):
        window.gapi.auth2
            .getAuthInstance()
            .signIn()
            .then((googleUser) => {
                const idToken = googleUser.getAuthResponse().id_token;
                resolve(idToken);
            })
            .catch((err) => {
                console.error('Google Sign-In Error:', err);
                reject(err);
            });
    });
}
