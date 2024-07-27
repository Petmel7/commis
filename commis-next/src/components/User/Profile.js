import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserProfile } from '../../services/auth';
import useModal from '../../hooks/useModal';
import ConfirmEmailModal from '../User/ConfirmEmailModal';
import AddPhoneNumber from '../User/AddPhoneNumber';
import ConfirmPhoneModal from '../User/ConfirmPhoneModal';
import useLoadingAndError from '../../hooks/useLoadingAndError';
import styles from './styles/Profile.module.css';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const loadingErrorComponent = useLoadingAndError(loading, error);

    const { isModalOpen: isEmailModalOpen, openModal: openEmailModal, closeModal: closeEmailModal } = useModal();
    const { isModalOpen: isAddPhoneModalOpen, openModal: openAddPhoneModal, closeModal: closeAddPhoneModal } = useModal();
    const { isModalOpen: isConfirmPhoneModalOpen, openModal: openConfirmPhoneModal, closeModal: closeConfirmPhoneModal } = useModal();

    const router = useRouter();

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const userProfile = await getUserProfile();

                if (!userProfile.emailconfirmed) {
                    openEmailModal();
                } else if (!userProfile.phone) {
                    openAddPhoneModal();
                } else if (!userProfile.phoneconfirmed) {
                    openConfirmPhoneModal();
                } else {
                    setUser(userProfile);
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        checkUserStatus();
    }, [router]);

    if (loadingErrorComponent) return loadingErrorComponent;

    return (
        <div>
            {user && (
                <div className={styles.profileContainer}>
                    <div className={styles.profileDetails}>
                        <p>Привіт! {user.name}</p>
                    </div>
                    <ul className={styles.profileLinks}>
                        <li>
                            <Link href='/product'>Додати продукт</Link>
                        </li>
                        <li>
                            <Link href='/myProducts'>Мої продукти</Link>
                        </li>
                        <li>
                            <Link href='/orders'>Замовлення</Link>
                        </li>
                    </ul>
                </div>
            )}
            {isEmailModalOpen && <ConfirmEmailModal show={isEmailModalOpen} onClose={closeEmailModal} email={user?.email} />}
            {isAddPhoneModalOpen && <AddPhoneNumber show={isAddPhoneModalOpen} onClose={closeAddPhoneModal} onPhoneAdded={openConfirmPhoneModal} />}
            {isConfirmPhoneModalOpen && <ConfirmPhoneModal show={isConfirmPhoneModalOpen} onClose={closeConfirmPhoneModal} phone={user?.phone} />}
        </div>
    );
};

export default Profile;

