'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parsePriceToNumber, formatPrice } from '@/lib/whatsapp';

export interface CartItem {
    productId: string;
    title: string;
    price: string; // Display format: "$1.200.000"
    priceNumeric: number; // Numeric for calculations
    imageUrl: string;
    quantity: number;
    category?: string;
    btuCapacity?: number;
}

export interface CartProduct {
    _id: string;
    title: string;
    price?: string;
    imageUrl?: string;
    category?: string;
    btuCapacity?: number;
}

interface CartContextType {
    items: CartItem[];
    cartCount: number;
    totalAmount: number;
    isOpen: boolean;
    addToCart: (product: CartProduct) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        setIsClient(true);
        const savedCart = localStorage.getItem('wtrebol-cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                setItems(parsed);
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
                localStorage.removeItem('wtrebol-cart');
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('wtrebol-cart', JSON.stringify(items));
        }
    }, [items, isClient]);

    // Calculate totals
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => total + item.priceNumeric * item.quantity, 0);

    // Add product to cart
    const addToCart = (product: CartProduct) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.productId === product._id);

            if (existingItem) {
                // Increment quantity if already in cart
                return currentItems.map((item) =>
                    item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Add new item
                const newItem: CartItem = {
                    productId: product._id,
                    title: product.title,
                    price: product.price || '$0',
                    priceNumeric: parsePriceToNumber(product.price || '$0'),
                    imageUrl: product.imageUrl || '',
                    quantity: 1,
                    category: product.category,
                    btuCapacity: product.btuCapacity,
                };
                return [...currentItems, newItem];
            }
        });

        // Open cart drawer to show feedback
        setIsOpen(true);

        // Auto-close after 2 seconds unless user interacts
        setTimeout(() => {
            setIsOpen(false);
        }, 2000);
    };

    // Remove product from cart
    const removeFromCart = (productId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
    };

    // Update quantity
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        );
    };

    // Clear all items
    const clearCart = () => {
        setItems([]);
        setIsOpen(false);
    };

    // Open/close drawer
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                cartCount,
                totalAmount,
                isOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
            }}
        >
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
