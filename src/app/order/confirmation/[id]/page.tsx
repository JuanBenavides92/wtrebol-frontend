'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { CheckCircle2, Package, Truck, Mail, Phone, MapPin, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';

interface OrderItem {
    productId: string;
    title: string;
    price: string;
    priceNumeric: number;
    quantity: number;
    subtotal: number;
    imageUrl: string;
}

interface ShippingInfo {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
}

interface OrderDetails {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    subtotal: number;
    taxVAT: number;
    shipping: number;
    total: number;
    status: string;
    paymentStatus: string;
    shippingInfo: ShippingInfo;
    createdAt: string;
    paidAt?: string;
}

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError('ID de orden no válido');
            setLoading(false);
            return;
        }

        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`), {
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setOrder(result.order);
            } else {
                setError(result.message || 'No se pudo cargar la orden');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('Error al cargar los detalles de la orden');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="min-h-screen py-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Cargando detalles de la orden...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (error || !order) {
        return (
            <PageLayout>
                <div className="min-h-screen py-20">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <AlertCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
                        <p className="text-gray-400 mb-8">{error || 'Orden no encontrada'}</p>
                        <Link
                            href="/tienda"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Volver a la Tienda
                        </Link>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const isPaid = order.paymentStatus === 'approved';
    const isPending = order.paymentStatus === 'pending';

    return (
        <PageLayout>
            <div className="min-h-screen py-20">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isPaid ? 'bg-emerald-500/20' : 'bg-yellow-500/20'
                            }`}>
                            {isPaid ? (
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            ) : (
                                <Package className="h-10 w-10 text-yellow-500" />
                            )}
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            {isPaid ? '¡Pago Exitoso!' : 'Orden Creada'}
                        </h1>
                        <p className="text-gray-400 text-lg mb-2">
                            {isPaid
                                ? 'Tu pago ha sido procesado correctamente'
                                : 'Tu orden ha sido creada y está pendiente de pago'}
                        </p>
                        <p className="text-gray-500">
                            Orden #{order.orderNumber}
                        </p>
                    </div>

                    {/* Payment Status Alert */}
                    {isPending && (
                        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-yellow-500 font-medium">Pago Pendiente</p>
                                    <p className="text-yellow-400 text-sm">
                                        Tu orden está pendiente de confirmación de pago. Recibirás un email cuando el pago sea confirmado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email Confirmation */}
                    {isPaid && (
                        <div className="mb-8 p-6 bg-sky-500/10 border border-sky-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium mb-1">Confirmación Enviada</p>
                                    <p className="text-gray-300 text-sm">
                                        Hemos enviado un email de confirmación a <span className="text-sky-400">{order.customerEmail}</span> con los detalles de tu pedido.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Productos */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Productos Ordenados
                                </h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.productId} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium mb-1">{item.title}</p>
                                                <p className="text-gray-400 text-sm">Cantidad: {item.quantity}</p>
                                                <p className="text-gray-400 text-sm">{item.price} c/u</p>
                                            </div>
                                            <p className="text-emerald-400 font-semibold">
                                                {formatPrice(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Información de Envío */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Información de Envío
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white font-medium">{order.shippingInfo.name}</p>
                                            <p className="text-gray-400 text-sm">{order.shippingInfo.address}</p>
                                            <p className="text-gray-400 text-sm">{order.shippingInfo.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Teléfono de contacto</p>
                                            <p className="text-white">{order.shippingInfo.phone}</p>
                                        </div>
                                    </div>
                                    {order.shippingInfo.notes && (
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-gray-400 text-sm mb-1">Notas adicionales</p>
                                            <p className="text-white text-sm">{order.shippingInfo.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-6">Resumen</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>IVA (19%)</span>
                                        <span>{formatPrice(order.taxVAT)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Envío</span>
                                        <span className="text-emerald-400">GRATIS</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-emerald-500">{formatPrice(order.total)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Estado del Pedido</span>
                                        <span className={`font-medium ${order.status === 'pending' ? 'text-yellow-400' :
                                            order.status === 'confirmed' ? 'text-sky-400' :
                                                order.status === 'processing' ? 'text-blue-400' :
                                                    order.status === 'shipped' ? 'text-purple-400' :
                                                        order.status === 'delivered' ? 'text-emerald-400' :
                                                            'text-gray-400'
                                            }`}>
                                            {order.status === 'pending' ? 'Pendiente' :
                                                order.status === 'confirmed' ? 'Confirmado' :
                                                    order.status === 'processing' ? 'Procesando' :
                                                        order.status === 'shipped' ? 'Enviado' :
                                                            order.status === 'delivered' ? 'Entregado' :
                                                                order.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Estado del Pago</span>
                                        <span className={`font-medium ${isPaid ? 'text-emerald-400' :
                                            isPending ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>
                                            {isPaid ? 'Pagado' :
                                                isPending ? 'Pendiente' :
                                                    order.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Fecha</span>
                                        <span className="text-white">
                                            {new Date(order.createdAt).toLocaleDateString('es-CO', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 mt-6 space-y-3">
                                    <Link
                                        href="/tienda"
                                        className="block w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white text-center rounded-lg transition-colors font-medium"
                                    >
                                        Seguir Comprando
                                    </Link>
                                    <Link
                                        href="/customer/dashboard"
                                        className="block w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-center rounded-lg transition-colors"
                                    >
                                        Ver Mis Pedidos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
