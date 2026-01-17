'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartContextType {
    cartCount: number;
    addToCart: () => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const [isClient, setIsClient] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        setIsClient(true);
        const savedCart = localStorage.getItem('wtrebol-cart-count');
        if (savedCart) {
            setCartCount(parseInt(savedCart, 10));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('wtrebol-cart-count', cartCount.toString());
        }
    }, [cartCount, isClient]);

    const addToCart = () => {
        setCartCount((prev) => prev + 1);
    };

    const clearCart = () => {
        setCartCount(0);
    };

    return (
        <CartContext.Provider value={{ cartCount, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

