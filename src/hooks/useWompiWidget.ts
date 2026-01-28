'use client';

import { useEffect } from 'react';

/**
 * Hook para cargar el script del Widget de Wompi
 */
export function useWompiWidget() {
    useEffect(() => {
        // Verificar si el script ya está cargado
        if (document.getElementById('wompi-widget-script')) {
            return;
        }

        // Crear y cargar el script
        const script = document.createElement('script');
        script.id = 'wompi-widget-script';
        script.src = 'https://checkout.wompi.co/widget.js';
        script.async = true;

        script.onload = () => {
            console.log('✅ Wompi Widget script loaded');
        };

        script.onerror = () => {
            console.error('❌ Error loading Wompi Widget script');
        };

        document.head.appendChild(script);

        // Cleanup
        return () => {
            const existingScript = document.getElementById('wompi-widget-script');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);
}

/**
 * Interface para la configuración del Widget de Wompi
 */
export interface WompiWidgetConfig {
    currency: 'COP';
    amountInCents: number;
    reference: string;
    publicKey: string;
    signature: {
        integrity: string;
    };
    redirectUrl?: string;
    customerData?: {
        email: string;
        fullName: string;
        phoneNumber: string;
        phoneNumberPrefix?: string;
    };
    shippingAddress?: {
        addressLine1: string;
        city: string;
        phoneNumber: string;
        region: string;
        country: string;
    };
    taxInCents?: {
        vat?: number;
        consumption?: number;
    };
}

/**
 * Interface para la respuesta del Widget
 */
export interface WompiWidgetResponse {
    transaction: {
        id: string;
        status: string;
        reference: string;
        amount_in_cents: number;
        currency: string;
        payment_method_type: string;
        [key: string]: any;
    };
}

/**
 * Abre el Widget de Wompi con la configuración proporcionada
 */
export function openWompiWidget(
    config: WompiWidgetConfig,
    onSuccess: (response: WompiWidgetResponse) => void,
    onError: (error: any) => void
): void {
    // Verificar que el script esté cargado
    if (typeof window === 'undefined' || !(window as any).WidgetCheckout) {
        console.error('❌ Wompi Widget not loaded');
        onError(new Error('Wompi Widget not loaded'));
        return;
    }

    try {
        // Crear instancia del checkout
        const checkout = new (window as any).WidgetCheckout(config);

        // Abrir el widget
        checkout.open((result: WompiWidgetResponse) => {
            console.log('✅ Wompi Widget response:', result);

            if (result && result.transaction) {
                onSuccess(result);
            } else {
                onError(new Error('Invalid response from Wompi'));
            }
        });
    } catch (error) {
        console.error('❌ Error opening Wompi Widget:', error);
        onError(error);
    }
}
