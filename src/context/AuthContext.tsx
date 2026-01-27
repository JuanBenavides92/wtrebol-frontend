'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const isAuthenticated = !!user;

    // Check authentication on mount
    useEffect(() => {
        // Solo verificar auth en rutas de admin
        if (typeof window !== 'undefined') {
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            if (isAdminRoute) {
                checkAuth();
            } else {
                setIsLoading(false);
            }
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    setUser(data.user);
                    localStorage.setItem('admin_user', JSON.stringify(data.user));
                }
            } else {
                // No autenticado, limpiar
                setUser(null);
                localStorage.removeItem('admin_user');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            localStorage.removeItem('admin_user');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUser(data.user);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
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
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('admin_user');
            router.push('/'); // Redirect to homepage
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

