
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { validateName, validateEmail, validatePassword } from '@/utils/validation';
import GoogleAuth from './GoogleAuth';
import styles from './styles/Auth.module.css';
import Link from 'next/link';
import useModal from '../../hooks/useModal';
import ConfirmEmailModal from './ConfirmEmailModal';
import useLoadingAndError from '../../hooks/useLoadingAndError';
import { REGISTER_USER } from '@/graphql/mutations/auth';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const { isModalOpen, openModal, closeModal } = useModal();

    const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

    const loadingErrorComponent = useLoadingAndError(loading, error?.message);

    const validateForm = () => {
        const nameError = validateName(name);
        const emailErrors = validateEmail(email);
        const passwordErrors = validatePassword(password);
        const errors = { ...nameError, ...emailErrors, ...passwordErrors };
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const { data } = await registerUser({ variables: { name, email, password } });

            console.log('data', data);
            if (data.registerUser === 'User registered successfully. Please check your email for confirmation.') {
                openModal();
            } else {
                setErrors({ form: data.register.message });
            }
        } catch (err) {
            setErrors({ form: err.message });
        }
    };

    if (loadingErrorComponent) return loadingErrorComponent;

    return (
        <>
            <form className={styles.authForm} onSubmit={handleSubmit}>
                <h2 className={styles.authHeading}>Реєстрація</h2>

                <input
                    className={`${styles.authInput} ${errors.name ? styles.errorInput : ''}`}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Імя"
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}

                <input
                    className={`${styles.authInput} ${errors.email ? styles.errorInput : ''}`}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}

                <input
                    className={`${styles.authInput} ${errors.password ? styles.errorInput : ''}`}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Пароль"
                />
                {errors.password && <p className={styles.errorText}>{errors.password}</p>}

                {errors.form && <p className={styles.errorText}>{errors.form}</p>}

                <button className={styles.authButton} type="submit">Зареєструватися</button>
                <GoogleAuth />
                <span className={styles.authText}>Вже є аккаунт?</span>
                <Link href='/login'>Увійти</Link>
            </form>
            <ConfirmEmailModal show={isModalOpen} onClose={closeModal} email={email} />
        </>
    );
};

export default Register;

