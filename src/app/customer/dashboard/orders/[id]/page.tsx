'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Loader2, MapPin, Phone, Mail, User, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';
import OrderProgressBar from '@/components/OrderProgressBar';
import PaymentReceipt from '@/components/PaymentReceipt';

interface OrderItem {
    productId: string;
    title: string;
    price: string;
    priceNumeric: number;
    quantity: number;
    imageUrl?: string;
    category?: string;
    btuCapacity?: number;
}

interface ShippingInfo {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    subtotal: number;
    shipping: number;
    status: string;
    createdAt: string;
    statusUpdatedAt?: string;
    items: OrderItem[];
    shippingInfo: ShippingInfo;
    notes?: string;
}

interface StatusHistoryItem {
    _id: string;
    previousStatus: string;
    newStatus: string;
    notes?: string;
    createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    processing: { label: 'En Proceso', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    shipped: { label: 'Enviado', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    delivered: { label: 'Entregado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`), {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setOrder(data.order);
                    setStatusHistory(data.statusHistory || []);
                }
            } else {
                router.push('/customer/dashboard');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            router.push('/customer/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <Package className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Pedido no encontrado</h2>
                <Link
                    href="/customer/dashboard"
                    className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-400"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a mis pedidos
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/customer/dashboard"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a mis pedidos
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Pedido #{order.orderNumber}
                        </h1>
                        <p className="text-gray-400">
                            Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${STATUS_LABELS[order.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                        {STATUS_LABELS[order.status]?.label || order.status}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <OrderProgressBar currentStatus={order.status as any} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Products */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Productos</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                                    {item.imageUrl && (
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                                        {item.btuCapacity && (
                                            <p className="text-xs text-gray-500">{item.btuCapacity} BTU</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Precio unitario</p>
                                        <p className="font-semibold text-white">{item.price}</p>
                                        <p className="text-sm text-emerald-400 font-semibold">
                                            {formatPrice(item.priceNumeric * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Información de Envío
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400">Nombre</p>
                                    <p className="text-white">{order.shippingInfo.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400">Teléfono</p>
                                    <p className="text-white">{order.shippingInfo.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400">Dirección</p>
                                    <p className="text-white">{order.shippingInfo.address}</p>
                                    <p className="text-gray-400">{order.shippingInfo.city}</p>
                                </div>
                            </div>
                            {order.shippingInfo.notes && (
                                <div className="flex items-start gap-3">
                                    <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Notas de entrega</p>
                                        <p className="text-white">{order.shippingInfo.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Resumen del Pedido</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-300">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Envío</span>
                                <span className={order.shipping === 0 ? 'text-emerald-400' : ''}>
                                    {order.shipping === 0 ? 'GRATIS' : formatPrice(order.shipping)}
                                </span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span className="text-emerald-500">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Receipt */}
                    <PaymentReceipt order={order as any} />

                    {/* Status History */}
                    {statusHistory.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Historial
                            </h2>
                            <div className="space-y-3">
                                {statusHistory.map((history, index) => (
                                    <div key={history._id} className="relative pl-6 pb-3 last:pb-0">
                                        {index < statusHistory.length - 1 && (
                                            <div className="absolute left-2 top-6 bottom-0 w-px bg-white/10"></div>
                                        )}
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-sky-500"></div>
                                        <p className={`text-sm font-semibold ${STATUS_LABELS[history.newStatus]?.color.split(' ')[1] || 'text-white'}`}>
                                            {STATUS_LABELS[history.newStatus]?.label || history.newStatus}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(history.createdAt).toLocaleString('es-ES')}
                                        </p>
                                        {history.notes && (
                                            <p className="text-xs text-gray-500 mt-1">{history.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
