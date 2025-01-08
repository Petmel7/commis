
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { CONFIRM_EMAIL } from '@/graphql/mutations/auth';

const ConfirmEmailPage = () => {
    const router = useRouter();
    const { token } = router.query;

    const [confirmEmail, { loading, error, data }] = useMutation(CONFIRM_EMAIL);

    useEffect(() => {
        if (token) {
            try {
                confirmEmail({ variables: { token } });
                alert('Email confirmed successfully');
                router.push('/login');
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    }, [token]);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error.message}</p>;

    return (
        <div>
            <h1>Підтвердження електронної пошти</h1>
            {data?.confirmEmail && <p>{data.confirmEmail}</p>}
        </div>
    );
};

export default ConfirmEmailPage;

