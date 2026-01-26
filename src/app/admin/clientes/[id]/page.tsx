'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, MapPin, Building2, ShoppingCart, Loader2, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    createdAt: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{
        title: string;
        quantity: number;
    }>;
}

interface CustomerStats {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    processing: { label: 'En Proceso', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    shipped: { label: 'Enviado', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    delivered: { label: 'Entregado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

export default function AdminCustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const customerId = params?.id as string;
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<CustomerStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (customerId) {
            fetchCustomerDetail();
        }
    }, [customerId]);

    const fetchCustomerDetail = async () => {
        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS}/${customerId}`),
                { credentials: 'include' }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCustomer(data.customer);
                    setOrders(data.orders || []);
                    setStats(data.stats || null);
                }
            } else {
                router.push('/admin/clientes');
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
            router.push('/admin/clientes');
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

    if (!customer) {
        return (
            <div className="p-8">
                <div className="text-center py-20">
                    <User className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Cliente no encontrado</h2>
                    <Link
                        href="/admin/clientes"
                        className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a clientes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/clientes"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a clientes
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">{customer.name}</h1>
                <p className="text-gray-400">Cliente desde {new Date(customer.createdAt).toLocaleDateString('es-ES')}</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-sky-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                        <p className="text-sm text-gray-400">Total Pedidos</p>
                    </div>

                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{formatPrice(stats.totalSpent)}</p>
                        <p className="text-sm text-gray-400">Gasto Total</p>
                    </div>

                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{formatPrice(stats.averageOrderValue)}</p>
                        <p className="text-sm text-gray-400">Promedio por Pedido</p>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Información del Cliente</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400">Nombre</p>
                                <p className="text-white font-medium">{customer.name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white">{customer.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400">Teléfono</p>
                                <p className="text-white">{customer.phone}</p>
                            </div>
                        </div>

                        {customer.address && (
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400">Dirección</p>
                                    <p className="text-white">{customer.address}</p>
                                    {customer.city && (
                                        <p className="text-sm text-gray-400">{customer.city}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400">Cliente desde</p>
                                <p className="text-white">
                                    {new Date(customer.createdAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders History */}
                <div className="lg:col-span-2 bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Historial de Pedidos</h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">Este cliente aún no ha realizado pedidos</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="border border-white/10 rounded-lg p-4 hover:bg-slate-800/30 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-white">
                                                    Pedido #{order.orderNumber}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_LABELS[order.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                                                    {STATUS_LABELS[order.status]?.label || order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                                                {' • '}
                                                {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-emerald-400">
                                                    {formatPrice(order.total)}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/admin/pedidos/${order._id}`}
                                                className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-sm rounded-lg transition-all border border-sky-500/30"
                                            >
                                                Ver Detalle
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
