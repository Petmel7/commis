
// import { createContext, useState, useContext, useEffect } from 'react';
// import { getUserProfile } from '../services/auth';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isRegistered, setIsRegistered] = useState(false);
//     const [isGoogleRegistered, setIsGoogleRegistered] = useState(false);
//     const [isBlocked, setIsBlocked] = useState(false);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const initializeAuth = async () => {
//             const accessToken = localStorage.getItem('accessToken');
//             if (accessToken) {
//                 setIsAuthenticated(true);
//                 await fetchUserProfile();
//             }
//             const registered = localStorage.getItem('isRegistered') === 'true';
//             if (registered) {
//                 setIsRegistered(true);
//             }
//             const googleRegistered = localStorage.getItem('isGoogleRegistered') === 'true';
//             if (googleRegistered) {
//                 setIsGoogleRegistered(true);
//             }
//             setLoading(false);
//         };

//         initializeAuth();
//     }, []);

//     const fetchUserProfile = async () => {
//         try {
//             const userProfile = await getUserProfile();
//             setUser(userProfile);
//         } catch (error) {
//             if (error.response && error.response.status === 403) {
//                 setIsBlocked(true);
//             } else {
//                 console.error('Помилка при завантаженні профілю користувача:', error);
//                 setUser(null);
//             }
//         }
//     };

//     const handleRegister = () => {
//         setIsRegistered(true);
//         localStorage.setItem('isRegistered', 'true');
//     };

//     const handleLogin = async () => {
//         setIsAuthenticated(true);
//         await fetchUserProfile();
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         setIsAuthenticated(false);
//         setUser(null);
//     };

//     const setGoogleRegisteredStatus = (value) => {
//         setIsGoogleRegistered(value);
//         localStorage.setItem('isGoogleRegistered', value.toString());
//     };

//     return (
//         <AuthContext.Provider value={{
//             isAuthenticated,
//             isRegistered,
//             isGoogleRegistered,
//             isBlocked,
//             user,
//             loading,
//             handleLogin,
//             handleLogout,
//             handleRegister,
//             setGoogleRegisteredStatus
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };


import { createContext, useState, useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '@/graphql/queries/user';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isGoogleRegistered, setIsGoogleRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    const { data, error, loading: profileLoading, refetch } = useQuery(GET_USER_PROFILE, {
        skip: !localStorage.getItem('accessToken'), // Запит виконується лише за наявності токена
        onCompleted: (data) => {
            if (data?.user) {
                setIsAuthenticated(true);
                setIsRegistered(true); // Наприклад, якщо реєстрація підтверджена
                setIsGoogleRegistered(false); // Оновіть залежно від статусу
            }
        },
        onError: (err) => {
            if (err.networkError?.statusCode === 403) {
                console.error('Користувач заблокований.');
            } else {
                console.error('Помилка при завантаженні профілю користувача:', err);
            }
        },
    });

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                await refetch();
            } catch (err) {
                console.error('Помилка при ініціалізації автентифікації:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [refetch]);

    const handleRegister = () => {
        setIsRegistered(true);
        localStorage.setItem('isRegistered', 'true');
    };

    const handleLogin = async () => {
        setIsAuthenticated(true);
        try {
            await refetch();
        } catch (err) {
            console.error('Помилка при вході в систему:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        window.location.reload(); // Скидає стан додатку
    };

    const setGoogleRegisteredStatus = (value) => {
        setIsGoogleRegistered(value);
        localStorage.setItem('isGoogleRegistered', value.toString());
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isRegistered,
                isGoogleRegistered,
                isBlocked: data?.user?.isBlocked || false,
                user: data?.user || null,
                loading: loading || profileLoading,
                handleLogin,
                handleLogout,
                handleRegister,
                setGoogleRegisteredStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
