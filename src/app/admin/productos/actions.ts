'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

/**
 * Server Action to save product (create or update)
 * This runs on the server and allows us to use revalidatePath
 */
export async function saveProductAction(
    formData: any,
    productId: string | null,
    isEdit: boolean
) {
    try {
        // Get API URL from environment
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        // Construct URL
        const url = isEdit && productId
            ? `${API_URL}/api/content/${productId}`
            : `${API_URL}/api/content`;

        console.log('🚀 [Server Action] Saving product to:', url);
        console.log('📦 [Server Action] Payload:', JSON.stringify(formData, null, 2));

        // Get session cookie for authentication
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('connect.sid');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Add cookie if exists
        if (sessionCookie) {
            headers['Cookie'] = `${sessionCookie.name}=${sessionCookie.value}`;
        }

        // Make request to backend
        const response = await fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ [Server Action] Product saved successfully');

            // ✨ REVALIDATE PATHS - This is the key to solving the problem
            revalidatePath('/tienda');
            revalidatePath('/admin/productos');

            console.log('🔄 [Server Action] Paths revalidated: /tienda, /admin/productos');

            return {
                success: true,
                data: result.data || result,
            };
        } else {
            console.error('❌ [Server Action] Error from backend:', result);
            return {
                success: false,
                error: result.message || 'Error al guardar el producto',
            };
        }
    } catch (error) {
        console.error('❌ [Server Action] Exception:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al guardar el producto',
        };
    }
}
