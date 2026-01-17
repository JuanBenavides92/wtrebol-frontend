/**
 * Configuración de API para conectar con el backend WTREBOL
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Interfaz para respuestas de la API
 */
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
}

/**
 * Función helper para hacer requests a la API
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // Importante para enviar cookies de sesión
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * API Client con métodos específicos
 */
export const api = {
    /**
     * Obtener contenido por tipo
     */
    getContentByType: async <T>(type: 'slide' | 'product' | 'service' | 'setting', activeOnly = true) => {
        const query = activeOnly ? '?active=true' : '';
        return apiRequest<T[]>(`/api/content/${type}${query}`);
    },

    /**
     * Obtener un contenido específico por ID
     */
    getContentById: async <T>(id: string) => {
        return apiRequest<T>(`/api/content/item/${id}`);
    },

    /**
     * Crear contenido (requiere autenticación)
     */
    createContent: async <T>(data: any) => {
        return apiRequest<T>('/api/content', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Actualizar contenido (requiere autenticación)
     */
    updateContent: async <T>(id: string, data: any) => {
        return apiRequest<T>(`/api/content/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * Eliminar contenido (requiere autenticación)
     */
    deleteContent: async (id: string) => {
        return apiRequest(`/api/content/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Login de administrador
     */
    login: async (email: string, password: string) => {
        return apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    /**
     * Logout
     */
    logout: async () => {
        return apiRequest('/api/auth/logout', {
            method: 'POST',
        });
    },

    /**
     * Obtener usuario actual
     */
    getCurrentUser: async () => {
        return apiRequest('/api/auth/me');
    },

    /**
     * Subir archivo (requiere autenticación)
     */
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Upload failed! status: ${response.status}`);
        }

        return response.json();
    },
};

export default api;
