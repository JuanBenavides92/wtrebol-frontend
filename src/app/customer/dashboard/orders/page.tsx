'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Eye, X, CreditCard, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import API_CONFIG from '@/lib/config';

interface Order {
    _id: string;
    orderNumber: string;
    status: 'pending_payment' | 'payment_confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'approved' | 'declined' | 'voided';
    total: number;
    items: any[];
    createdAt: string;
    paidAt?: string;
}

type TabType = 'all' | 'pending' | 'paid';

const statusConfig = {
    pending_payment: { label: 'Pendiente de Pago', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Clock },
    payment_confirmed: { label: 'Pago Confirmado', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
    preparing: { label: 'En Preparación', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Package },
    shipped: { label: 'En Camino', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Truck },
    delivered: { label: 'Entregado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
    cancelled: { label: 'Cancelada', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: XCircle }
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [cancellingId, setCancellingId] = useState<string | null>(null);

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
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
            return;
        }

        setCancellingId(orderId);
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    reason: 'Cancelado por el cliente'
                })
            });

            if (response.ok) {
                // Actualizar la lista de órdenes
                fetchOrders();
            } else {
                const data = await response.json();
                alert(data.message || 'Error al cancelar el pedido');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Error al cancelar el pedido');
        } finally {
            setCancellingId(null);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'pending') {
            return order.status === 'pending_payment';
        } else if (activeTab === 'paid') {
            return order.status !== 'pending_payment' && order.status !== 'cancelled';
        }
        return true; // 'all'
    });

    const formatPrice = (amount: number) => {
        return `$${amount.toLocaleString('es-CO')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Mis Pedidos</h1>
                <p className="text-gray-400">Gestiona y revisa el estado de tus pedidos</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'all'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Todos ({orders.length})
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'pending'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Pendientes ({orders.filter(o => o.status === 'pending_payment').length})
                </button>
                <button
                    onClick={() => setActiveTab('paid')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'paid'
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Pagados ({orders.filter(o => o.status !== 'pending_payment' && o.status !== 'cancelled').length})
                </button>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 mt-4">Cargando pedidos...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                    <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No tienes pedidos en esta categoría</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const StatusIcon = statusConfig[order.status].icon;
                        const canCancel = order.status === 'pending_payment';

                        return (
                            <div
                                key={order._id}
                                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Order Number & Date */}
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-xl font-bold text-white">
                                                {order.orderNumber}
                                            </h3>
                                            <span className="text-sm text-gray-400">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig[order.status].color}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    {statusConfig[order.status].label}
                                                </span>
                                            </div>
                                            {order.paymentStatus === 'approved' && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-green-500/20 text-green-400 border-green-500/30">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Pagado</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Items Count & Total */}
                                        <div className="flex items-center gap-6 text-sm text-gray-400">
                                            <span>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</span>
                                            <span className="text-2xl font-bold text-white">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => router.push(`/customer/dashboard/orders/${order._id}`)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver
                                        </button>
                                        {canCancel && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                disabled={cancellingId === order._id}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <X className="w-4 h-4" />
                                                {cancellingId === order._id ? 'Cancelando...' : 'Cancelar'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
