
// import React from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '../../context/AuthContext';
// import { logoutUser } from '../../services/auth';
// import Modal from '../Modal/Modal';
// import useModal from '../../hooks/useModal';
// import styles from './styles/Auth.module.css';

// const Logout = () => {
//     const { isModalOpen, openModal, closeModal } = useModal();
//     const router = useRouter();
//     const { handleLogout } = useAuth();

//     const handleConfirmLogout = async () => {
//         try {
//             const refreshToken = localStorage.getItem('refreshToken');
//             if (!refreshToken) {
//                 console.error('No refresh token found in local storage');
//                 return;
//             }

//             await logoutUser({ token: refreshToken });
//             handleLogout();

//             router.push('/login');
//         } catch (error) {
//             console.error('Logout failed:', error);
//         } finally {
//             closeModal();
//         }
//     };

//     return (
//         <>
//             <p className={styles.logout} onClick={openModal}>Вийти</p>

//             <Modal show={isModalOpen} onClose={closeModal} text='Ви справді хочете вийти?'>
//                 <div className={styles.modalContainer}>
//                     <div className={styles.modalButtons}>
//                         <button onClick={handleConfirmLogout}>Так</button>
//                         <button onClick={closeModal}>Ні</button>
//                     </div>
//                 </div>
//             </Modal>
//         </>
//     );
// };

// export default Logout;



import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { LOGOUT_USER } from '@/graphql/mutations/auth';
import { useAuth } from '@/context/AuthContext';
import Modal from '../Modal/Modal';
import useModal from '@/hooks/useModal';
import styles from './styles/Auth.module.css';

const Logout = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const router = useRouter();
    const { handleLogout } = useAuth();

    const [logoutUser] = useMutation(LOGOUT_USER);

    const handleConfirmLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('No refresh token found in local storage');
                return;
            }

            const { data } = await logoutUser({
                variables: { refreshToken },
            });

            if (data.logoutUser.success) {
                handleLogout();
                router.push('/login');
            } else {
                console.error('Logout failed:', data.logoutUser.message);
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            closeModal();
        }
    };

    return (
        <>
            <p className={styles.logout} onClick={openModal}>Вийти</p>

            <Modal show={isModalOpen} onClose={closeModal} text='Ви справді хочете вийти?'>
                <div className={styles.modalContainer}>
                    <div className={styles.modalButtons}>
                        <button onClick={handleConfirmLogout}>Так</button>
                        <button onClick={closeModal}>Ні</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Logout;

