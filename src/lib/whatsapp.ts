import { CartItem } from '@/context/CartContext';

/**
 * Generate WhatsApp link with cart items for quotation
 */
export function generateWhatsAppLink(items: CartItem[], total: number): string {
    const phone = '573001234567'; // WTREBOL contact number - UPDATE THIS

    if (items.length === 0) {
        const message = '¡Hola WTREBOL! 👋\n\nMe gustaría solicitar información sobre sus productos de climatización.';
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }

    const itemsList = items
        .map((item, index) => {
            const itemTotal = item.priceNumeric * item.quantity;
            return `${index + 1}. ${item.title}
   💰 Precio unitario: ${item.price}
   📦 Cantidad: ${item.quantity}
   💵 Subtotal: $${itemTotal.toLocaleString('es-CO')}${item.btuCapacity ? `\n   ❄️ Capacidad: ${item.btuCapacity.toLocaleString()} BTU` : ''}${item.category ? `\n   📂 Categoría: ${getCategoryLabel(item.category)}` : ''}`;
        })
        .join('\n\n');

    const message = `¡Hola WTREBOL! 👋

Me gustaría solicitar cotización para los siguientes productos:

${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 TOTAL ESTIMADO: $${total.toLocaleString('es-CO')}
━━━━━━━━━━━━━━━━━━━━

Quedo atento a su respuesta para coordinar la entrega.

¡Gracias!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Format price string to number
 */
export function parsePriceToNumber(priceString: string): number {
    // Remove currency symbols and dots, convert to number
    const cleaned = priceString.replace(/[$.]/g, '').replace(/,/g, '');
    return parseInt(cleaned, 10) || 0;
}

/**
 * Format number to Colombian currency
 */
export function formatPrice(amount: number | undefined | null): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '$0';
    }
    return `$${amount.toLocaleString('es-CO')}`;
}

/**
 * Get category label in Spanish
 */
export function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        split: 'Split/Minisplit',
        cassette: 'Cassette 4 Vías',
        'piso-cielo': 'Piso-Cielo',
        industrial: 'Industrial',
        accesorio: 'Accesorio',
    };
    return labels[category] || category;
}

/**
 * Get usage type label in Spanish
 */
export function getUsageTypeLabel(usageType: string): string {
    const labels: Record<string, string> = {
        residencial: 'Residencial',
        comercial: 'Comercial',
        industrial: 'Industrial',
    };
    return labels[usageType] || usageType;
}
