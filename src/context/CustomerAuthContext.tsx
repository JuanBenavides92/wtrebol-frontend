'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import API_CONFIG from '@/lib/config';

interface Customer {
    id: string;
    email: string;
    name: string;
    phone: string;
    address?: string;
    city?: string;
}

interface CustomerAuthContextType {
    customer: Customer | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateProfile: (data: Partial<Customer>) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    city?: string;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAuthenticated = !!customer;

    // Check authentication on mount
    useEffect(() => {
        // Verificar auth en rutas de customer y checkout
        if (typeof window !== 'undefined') {
            const isCustomerRoute = window.location.pathname.startsWith('/customer');
            const isCheckoutRoute = window.location.pathname.startsWith('/checkout');

            if (isCustomerRoute || isCheckoutRoute) {
                checkAuth();
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.CUSTOMER_ME), {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.customer) {
                    setCustomer(data.customer);
                    localStorage.setItem('customer', JSON.stringify(data.customer));
                }
            } else {
                // No autenticado, limpiar
                setCustomer(null);
                localStorage.removeItem('customer');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setCustomer(null);
            localStorage.removeItem('customer');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setCustomer(result.customer);
                localStorage.setItem('customer', JSON.stringify(result.customer));
                return { success: true };
            } else {
                return { success: false, error: result.message || 'Error al registrar' };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'Error al conectar con el servidor' };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.CUSTOMER_LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setCustomer(data.customer);
                localStorage.setItem('customer', JSON.stringify(data.customer));
                return { success: true };
            } else {
                return { success: false, error: data.message || 'Credenciales incorrectas' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Error al conectar con el servidor' };
        }
    };

    const logout = async () => {
        try {
            await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.CUSTOMER_LOGOUT), {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setCustomer(null);
            localStorage.removeItem('customer');
            router.push('/');
        }
    };

    const updateProfile = async (data: Partial<Customer>) => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.CUSTOMER_ME), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setCustomer(result.customer);
                localStorage.setItem('customer', JSON.stringify(result.customer));
                return { success: true };
            } else {
                return { success: false, error: result.message || 'Error al actualizar perfil' };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Error al conectar con el servidor' };
        }
    };

    return (
        <CustomerAuthContext.Provider
            value={{
                customer,
                isLoading,
                isAuthenticated,
                login,
                register,
                logout,
                checkAuth,
                updateProfile,
            }}
        >
            {children}
        </CustomerAuthContext.Provider>
    );
}

export function useCustomerAuth() {
    const context = useContext(CustomerAuthContext);
    if (context === undefined) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
}
