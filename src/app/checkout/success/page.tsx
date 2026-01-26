'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { CheckCircle2, Package, Home, Eye } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Opcional: Llamar analytics o eventos de conversión aquí
        console.log('Pedido completado:', orderId, orderNumber);
    }, [orderId, orderNumber]);

    return (
        <PageLayout>
            <div className="min-h-screen py-20">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Success Icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 border-4 border-emerald-500 rounded-full mb-6">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            ¡Pedido Realizado con Éxito!
                        </h1>
                        <p className="text-xl text-gray-300">
                            Gracias por tu compra. Tu pedido ha sido registrado correctamente.
                        </p>
                    </div>

                    {/* Order Info Card */}
                    {orderNumber && (
                        <div className="bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-sky-500/30 rounded-2xl p-8 mb-8">
                            <div className="text-center">
                                <p className="text-gray-400 mb-2">Número de Pedido</p>
                                <p className="text-3xl font-bold text-sky-400">{orderNumber}</p>
                                <p className="text-sm text-gray-400 mt-4">
                                    Guarda este número para hacer seguimiento de tu pedido
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">¿Qué sigue?</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sky-400 font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Confirmación del Pedido</h3>
                                    <p className="text-gray-400">Nuestro equipo revisará tu pedido y te contactará pronto para confirmar los detalles.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sky-400 font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Coordinación de Pago</h3>
                                    <p className="text-gray-400">Te contactaremos para coordinar el método de pago más conveniente para ti.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sky-400 font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Preparación y Envío</h3>
                                    <p className="text-gray-400">Una vez confirmado el pago, prepararemos tu pedido para el envío.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-400 font-bold">4</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Entrega</h3>
                                    <p className="text-gray-400">Recibirás tu pedido en la dirección especificada.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">¿Necesitas ayuda?</h2>
                        <p className="text-gray-300 mb-4">
                            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:
                        </p>
                        <div className="space-y-2 text-gray-300">
                            <p>📧 Email: ventas@wtrebol.com</p>
                            <p>📱 WhatsApp: +57 300 123 4567</p>
                            <p>🕐 Horario: Lunes a Viernes, 8:00 AM - 6:00 PM</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            <Home className="h-5 w-5" />
                            Volver al Inicio
                        </Link>
                        <Link
                            href="/tienda"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                            <Package className="h-5 w-5" />
                            Seguir Comprando
                        </Link>
                    </div>

                    {/* Recommendation */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            💡 Tip: Guarda el número de pedido <strong className="text-white">{orderNumber}</strong> para futuras consultas
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <PageLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Cargando...</p>
                    </div>
                </div>
            </PageLayout>
        }>
            <SuccessContent />
        </Suspense>
    );
}
