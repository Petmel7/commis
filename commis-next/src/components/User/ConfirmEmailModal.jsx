
import React from 'react';
import { useMutation } from '@apollo/client';
import { RESEND_CONFIRMATION_EMAIL } from '@/graphql/mutations/auth';
import Modal from '../Modal/Modal';
import styles from './styles/Auth.module.css';

const ConfirmEmailModal = ({ show, onClose, email }) => {
    const [resendConfirmationEmail, { loading, error, data }] = useMutation(RESEND_CONFIRMATION_EMAIL);

    const googleMailUrl = `https://mail.google.com/mail/?authuser=${email}`;

    const handleResend = async () => {
        try {
            await resendConfirmationEmail({ variables: { email } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal show={show} onClose={onClose} text="Підтвердіть електронну пошту">
            <div className={styles.modalContainer}>
                {loading ? (
                    <p>Завантаження...</p>
                ) : error ? (
                    <p className={styles.errorText}>Помилка: {error.message}</p>
                ) : (
                    <div className={styles.confirmEmailContent}>
                        <p>Ми надіслали посилання для підтвердження на електронну пошту: {email}</p>
                        {data?.resendConfirmationEmail?.message && (
                            <p className={styles.successText}>{data.resendConfirmationEmail.message}</p>
                        )}
                        <a
                            className={styles.authButton}
                            href={googleMailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Перейти до пошти
                        </a>
                        <button className={styles.authButton} onClick={handleResend}>
                            Надіслати знову
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ConfirmEmailModal;
