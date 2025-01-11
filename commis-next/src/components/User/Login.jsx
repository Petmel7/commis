
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { login } from '../../services/auth';
// import { validateEmail, validatePassword } from '@/utils/validation';
// import GoogleAuth from './GoogleAuth';
// import useLoadingAndError from '../../hooks/useLoadingAndError';
// import styles from './styles/Auth.module.css';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const { handleLogin } = useAuth();
//     const router = useRouter();

//     const loadingErrorComponent = useLoadingAndError(loading, error);

//     const validateForm = () => {
//         const emailErrors = validateEmail(email);
//         const passwordErrors = validatePassword(password);
//         const errors = { ...emailErrors, ...passwordErrors };
//         setErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setLoading(true);
//         setError(null);

//         try {
//             await login({ email, password });
//             handleLogin();
//             router.push('/profile');
//             setLoading(false);
//         } catch (error) {
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     if (loadingErrorComponent) return loadingErrorComponent;

//     return (
//         <form className={styles.authForm} onSubmit={handleSubmit}>
//             <h2 className={styles.authHeading}>Увійти</h2>

//             <input className={`${styles.authInput} ${errors.email ? styles.errorInput : ''}`} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
//             {errors.email && <p className={styles.errorText}>{errors.email}</p>}

//             <input className={`${styles.authInput} ${errors.password ? styles.errorInput : ''}`} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" />
//             {errors.password && <p className={styles.errorText}>{errors.password}</p>}

//             <button className={styles.authButton} type="submit">Увійти</button>
//             <GoogleAuth />
//             <span className={styles.authText}>Немає аккаунта?</span>
//             <Link href='/register'>Зареєструватися</Link>
//         </form>
//     );
// };

// export default Login;




import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@apollo/client';
import { validateEmail, validatePassword } from '@/utils/validation';
import { LOGIN_USER } from '@/graphql/mutations/auth';
import GoogleAuth from './GoogleAuth';
import useLoadingAndError from '../../hooks/useLoadingAndError';
import styles from './styles/Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { handleLogin } = useAuth();
    const router = useRouter();

    const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

    const loadingErrorComponent = useLoadingAndError(loading, error?.message);

    const validateForm = () => {
        const emailErrors = validateEmail(email);
        const passwordErrors = validatePassword(password);
        const errors = { ...emailErrors, ...passwordErrors };
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const { data } = await loginUser({
                variables: { email, password },
            });

            console.log('loginUser->data', data);

            if (data.loginUser) {
                handleLogin(data.loginUser.token, data.loginUser.user);
                router.push('/profile');
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    if (loadingErrorComponent) return loadingErrorComponent;

    return (
        <form className={styles.authForm} onSubmit={handleSubmit}>
            <h2 className={styles.authHeading}>Увійти</h2>

            <input
                className={`${styles.authInput} ${errors.email ? styles.errorInput : ''}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}

            <input
                className={`${styles.authInput} ${errors.password ? styles.errorInput : ''}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
            />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}

            <button className={styles.authButton} type="submit">
                Увійти
            </button>
            <GoogleAuth />
            <span className={styles.authText}>Немає аккаунта?</span>
            <Link href="/register">Зареєструватися</Link>
        </form>
    );
};

export default Login;

