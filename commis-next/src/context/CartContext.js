
// import React, { createContext, useState, useContext, useEffect } from 'react';

// const CartContext = createContext();

// export const useCart = () => {
//     return useContext(CartContext);
// };

// export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState([]);

//     useEffect(() => {
//         const savedCart = localStorage.getItem('cart');
//         if (savedCart) {
//             setCart(JSON.parse(savedCart));
//         }
//     }, []);

//     useEffect(() => {
//         localStorage.setItem('cart', JSON.stringify(cart));
//     }, [cart]);

//     const addToCart = (product, selectedSize) => {
//         setCart(prevCart => [...prevCart, { ...product, size: selectedSize, quantity: 1 }]);
//     };

//     const increaseQuantity = (productId) => {
//         setCart(prevCart => prevCart.map(item =>
//             item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
//         ));
//     };

//     const decreaseQuantity = (productId) => {
//         setCart(prevCart => prevCart.map(item =>
//             item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
//         ));
//     };

//     const removeFromCart = (productId) => {
//         setCart(prevCart => prevCart.filter(item => item.id !== productId));
//     };

//     const clearCart = () => {
//         setCart([]);
//     };

//     return (
//         <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart }}>
//             {children}
//         </CartContext.Provider>
//     );
// };


import React, { createContext, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CART, ADD_TO_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART } from '@/graphql/queries/cart';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { data, loading, error, refetch } = useQuery(GET_CART);

    const [addToCartMutation] = useMutation(ADD_TO_CART);
    const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
    const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
    const [clearCartMutation] = useMutation(CLEAR_CART);

    const cart = data?.cart?.items || [];

    const addToCart = async (productId, size) => {
        try {
            await addToCartMutation({
                variables: { productId, size },
            });
            refetch();
        } catch (err) {
            console.error('Помилка при додаванні до кошика:', err);
        }
    };

    const increaseQuantity = async (productId, currentQuantity) => {
        try {
            await updateCartItemMutation({
                variables: { productId, quantity: currentQuantity + 1 },
            });
            refetch();
        } catch (err) {
            console.error('Помилка при збільшенні кількості:', err);
        }
    };

    const decreaseQuantity = async (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            try {
                await updateCartItemMutation({
                    variables: { productId, quantity: currentQuantity - 1 },
                });
                refetch();
            } catch (err) {
                console.error('Помилка при зменшенні кількості:', err);
            }
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await removeFromCartMutation({
                variables: { productId },
            });
            refetch();
        } catch (err) {
            console.error('Помилка при видаленні з кошика:', err);
        }
    };

    const clearCart = async () => {
        try {
            await clearCartMutation();
            refetch();
        } catch (err) {
            console.error('Помилка при очищенні кошика:', err);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
