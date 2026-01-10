import { useState } from 'react';
import api from '@/lib/api';

/**
 * Interfaz para el usuario
 */
interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

/**
 * Hook para autenticación
 */
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Login
     */
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.login(email, password);

            if (response.success && response.data) {
                setUser(response.data as any);
                return true;
            } else {
                setError(response.message || 'Error al iniciar sesión');
                return false;
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout
     */
    const logout = async () => {
        try {
            setLoading(true);
            await api.logout();
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Verificar sesión actual
     */
    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await api.getCurrentUser();

            if (response.success && response.data) {
                setUser(response.data as any);
            }
        } catch (err) {
            console.error('Check auth error:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!user,
    };
}
