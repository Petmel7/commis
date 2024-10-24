import { useRouter } from "next/router";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from '../Product/styles/ProductCard.module.css';

const BuyButton = ({ product, selectedSize }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuy = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!selectedSize) {
                // Якщо розмір не вибраний, показуємо помилку
                throw new Error('Будь ласка, виберіть розмір перед додаванням в кошик.');
            }

            // Додаємо продукт з вибраним розміром у кошик
            addToCart(product, selectedSize);

            // Перенаправлення на сторінку кошика
            router.push('/cart');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button className={styles.productCardButton} onClick={handleBuy} disabled={loading}>
                {loading ? 'Завантаження...' : 'Купити'}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>} {/* Відображення помилки */}
        </>
    );
};

export default BuyButton;






// import { useRouter } from "next/router";
// import { useState } from "react";
// import { useCart } from "@/context/CartContext";
// import styles from '../Product/styles/ProductCard.module.css';

// const BuyButton = ({ product, selectedSize }) => {
//     console.log('BuyButton->selectedSize', selectedSize);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const { addToCart } = useCart();
//     const router = useRouter();

//     const handleBuy = async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             addToCart(product, selectedSize);
//             router.push('/cart');
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <button className={styles.productCardButton} onClick={handleBuy}>
//             {loading ? 'Завантаження...' : 'Купити'}
//         </button>
//     )
// }

// export default BuyButton;
