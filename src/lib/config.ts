/**
 * Centralized API Configuration for WTREBOL
 * All API calls should use this configuration
 */

const getApiUrl = (): string => {
    // Environment variable with fallback
    if (typeof window !== 'undefined') {
        // Client-side
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    } else {
        // Server-side
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    }
};

export const API_CONFIG = {
    BASE_URL: getApiUrl(),
    ENDPOINTS: {
        // Auth
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        ME: '/api/auth/me',

        // Content
        CONTENT: '/api/content',
        SLIDES: '/api/content/slide',
        PRODUCTS: '/api/content/product',
        SERVICES: '/api/content/service',
        ADVANTAGES: '/api/content/advantage',
        FAQ: '/api/content/faq',

        // Customers (E-commerce)
        CUSTOMER_REGISTER: '/api/customers/register',
        CUSTOMER_LOGIN: '/api/customers/login',
        CUSTOMER_LOGOUT: '/api/customers/logout',
        CUSTOMER_ME: '/api/customers/me',

        // Orders (E-commerce)
        ORDERS: '/api/orders',
        MY_ORDERS: '/api/orders/my-orders',

        // Admin - Orders
        ADMIN_ORDERS: '/api/admin/orders',
        ADMIN_ORDERS_STATS: '/api/admin/orders/stats',

        // Admin - Customers
        ADMIN_CUSTOMERS: '/api/admin/customers',
        ADMIN_CUSTOMERS_STATS: '/api/admin/customers/stats',

        // Admin - Users
        ADMIN_USERS: '/api/admin/users',
        ADMIN_USERS_STATS: '/api/admin/users/stats',

        // Appointments
        APPOINTMENTS: '/api/appointments',
        PUBLIC_APPOINTMENTS: '/api/public/appointments',
        APPOINTMENT_TYPES: '/api/public/appointment-types',
        AVAILABLE_SLOTS: '/api/public/available-slots',
        APPOINTMENT_SETTINGS: '/api/appointment-settings',

        // Technicians
        TECHNICIANS: '/api/technicians',

        // Time Blocks
        TIME_BLOCKS: '/api/time-blocks',

        // Upload
        UPLOAD: '/api/upload',
    },

    // Helper to build full URL
    url: (endpoint: string): string => {
        return `${API_CONFIG.BASE_URL}${endpoint}`;
    },

    // Helper for fetch with credentials
    fetchOptions: (options: RequestInit = {}): RequestInit => {
        return {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };
    },
};

export default API_CONFIG;
