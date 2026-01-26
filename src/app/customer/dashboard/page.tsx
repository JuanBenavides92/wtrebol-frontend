'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye, Loader2, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{
        title: string;
        quantity: number;
        imageUrl?: string;
    }>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    processing: { label: 'En Proceso', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    shipped: { label: 'Enviado', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    delivered: { label: 'Entregado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

export default function CustomerOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.MY_ORDERS), {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setOrders(data.orders);
                }
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Mis Pedidos</h1>
                <p className="text-gray-400">Revisa el estado de tus pedidos</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterStatus === 'all'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    Todos ({orders.length})
                </button>
                {Object.entries(STATUS_LABELS).map(([status, { label }]) => {
                    const count = orders.filter(o => o.status === status).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {filterStatus === 'all' ? 'No tienes pedidos aún' : 'No hay pedidos con este estado'}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {filterStatus === 'all' ? 'Empieza a comprar en nuestra tienda' : 'Prueba con otro filtro'}
                    </p>
                    {filterStatus === 'all' && (
                        <Link
                            href="/tienda"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-lg hover:from-sky-400 hover:to-emerald-400 transition-all"
                        >
                            Ir a la Tienda
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white">
                                            Pedido #{order.orderNumber}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_LABELS[order.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                                            {STATUS_LABELS[order.status]?.label || order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Total</p>
                                        <p className="text-2xl font-bold text-emerald-400">
                                            {formatPrice(order.total)}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/customer/dashboard/orders/${order._id}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Ver Detalle
                                    </Link>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {order.items.slice(0, 3).map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-white/5 rounded-lg p-2 min-w-fit"
                                    >
                                        {item.imageUrl && (
                                            <div className="w-10 h-10 rounded bg-slate-700 overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-white truncate max-w-[150px]">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-400">x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="flex items-center justify-center px-3 bg-white/5 rounded-lg text-gray-400 text-xs">
                                        +{order.items.length - 3} más
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
