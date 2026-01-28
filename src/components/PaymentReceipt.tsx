'use client';

import { CreditCard, ExternalLink, CheckCircle, Clock } from 'lucide-react';

interface PaymentReceiptProps {
    order: {
        paymentStatus: 'pending' | 'approved' | 'declined' | 'voided';
        total: number;
        wompiTransactionId?: string;
        wompiPaymentMethod?: string;
        wompiCardBrand?: string;
        wompiCardLast4?: string;
        wompiApprovalCode?: string;
        wompiPaymentLink?: string;
        paidAt?: string;
    };
}

export default function PaymentReceipt({ order }: PaymentReceiptProps) {
    const formatPrice = (amount: number) => {
        return `$${amount.toLocaleString('es-CO')}`;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isPaid = order.paymentStatus === 'approved';

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Comprobante de Pago</h3>
                {isPaid ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Pagado</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Pendiente</span>
                    </div>
                )}
            </div>

            {isPaid ? (
                <div className="space-y-4">
                    {/* Monto */}
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-gray-400">Monto Total</span>
                        <span className="text-2xl font-bold text-white">{formatPrice(order.total)}</span>
                    </div>

                    {/* Método de Pago */}
                    {order.wompiPaymentMethod && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Método de Pago</span>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-blue-400" />
                                <span className="text-white font-medium">
                                    {order.wompiPaymentMethod === 'CARD' ? 'Tarjeta' : order.wompiPaymentMethod}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Tarjeta */}
                    {order.wompiCardBrand && order.wompiCardLast4 && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Tarjeta</span>
                            <span className="text-white font-medium">
                                {order.wompiCardBrand} •••• {order.wompiCardLast4}
                            </span>
                        </div>
                    )}

                    {/* Fecha de Pago */}
                    {order.paidAt && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Fecha de Pago</span>
                            <span className="text-white">{formatDate(order.paidAt)}</span>
                        </div>
                    )}

                    {/* ID de Transacción */}
                    {order.wompiTransactionId && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">ID de Transacción</span>
                            <span className="text-white font-mono text-sm">{order.wompiTransactionId}</span>
                        </div>
                    )}

                    {/* Código de Aprobación */}
                    {order.wompiApprovalCode && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Código de Aprobación</span>
                            <span className="text-white font-mono text-sm">{order.wompiApprovalCode}</span>
                        </div>
                    )}

                    {/* Enlace al Recibo Oficial */}
                    {order.wompiPaymentLink && (
                        <div className="pt-4 border-t border-white/10">
                            <a
                                href={order.wompiPaymentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Ver Recibo Oficial de Wompi
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Este pedido aún no ha sido pagado</p>
                    <p className="text-sm text-gray-500 mt-2">
                        El comprobante estará disponible una vez se complete el pago
                    </p>
                </div>
            )}
        </div>
    );
}
