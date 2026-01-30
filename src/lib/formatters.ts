/**
 * Format price to Colombian Peso (COP) accounting format
 * @param price - Price as string or number
 * @returns Formatted price string (e.g., "$7.000.000")
 */
export const formatPrice = (price?: string | number): string => {
    if (!price) return '-';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '-';
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numPrice);
};

/**
 * Parse price string to number
 * @param price - Price string (e.g., "$7.000.000" or "7000000")
 * @returns Numeric value
 */
export const parsePriceToNumber = (price: string): number => {
    // Remove currency symbols, dots, and spaces
    const cleaned = price.replace(/[$.\s]/g, '');
    return parseFloat(cleaned) || 0;
};
