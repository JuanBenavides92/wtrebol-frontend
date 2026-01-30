'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Filter, Eye, Edit, Loader2, TrendingUp, ShoppingCart, Users, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';

interface Order {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{
        title: string;
        quantity: number;
        imageUrl?: string;
    }>;
}

interface Stats {
    totalOrders: number;
    ordersToday: number;
    ordersThisWeek: number;
    byStatus: Array<{
        _id: string;
        count: number;
        totalAmount: number;
    }>;
    revenue: {
        totalRevenue: number;
        averageOrderValue: number;
    };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    payment_confirmed: { label: 'Pago Confirmado', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    preparing: { label: 'En Preparación', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    shipped: { label: 'Enviado', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    delivered: { label: 'Entregado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [filterStatus, searchQuery, startDate, endDate]);

    const fetchOrders = async () => {
        try {
            let url = API_CONFIG.url(API_CONFIG.ENDPOINTS.ADMIN_ORDERS);
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (searchQuery) params.append('search', searchQuery);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url, { credentials: 'include' });

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

    const fetchStats = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.ADMIN_ORDERS_STATS), {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setStats(data.stats);
                }
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Gestión de Pedidos</h1>
                <p className="text-gray-400">Administra y da seguimiento a todos los pedidos</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-sky-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                        <p className="text-sm text-gray-400">Total Pedidos</p>
                    </div>

                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {formatPrice(stats.revenue.totalRevenue)}
                        </p>
                        <p className="text-sm text-gray-400">Ingresos Totales</p>
                    </div>

                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.ordersThisWeek}</p>
                        <p className="text-sm text-gray-400">Esta Semana</p>
                    </div>

                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-orange-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.ordersToday}</p>
                        <p className="text-sm text-gray-400">Hoy</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex flex-col gap-4">
                    {/* Search and Status Row */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por número de pedido, email o nombre..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:bg-slate-800 transition-all"
                                />
                            </div>
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500/50 transition-all"
                        >
                            <option value="">Todos los estados</option>
                            {Object.entries(STATUS_LABELS).map(([status, { label }]) => (
                                <option key={status} value={status}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range Row */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Fecha Inicio</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500/50 focus:bg-slate-800 transition-all [color-scheme:dark]"
                                    style={{
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Fecha Fin</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500/50 focus:bg-slate-800 transition-all [color-scheme:dark]"
                                    style={{
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                        </div>
                        {(startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                }}
                                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all border border-red-500/30 self-end"
                            >
                                Limpiar Fechas
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No hay pedidos</h2>
                        <p className="text-gray-400">
                            {searchQuery || filterStatus
                                ? 'No se encontraron pedidos con los filtros aplicados'
                                : 'Aún no hay pedidos registrados'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Pedido
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Productos
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-semibold text-white">
                                                #{order.orderNumber}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-white">
                                                {order.customerName}
                                            </p>
                                            <p className="text-sm text-gray-400">{order.customerEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">
                                                {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-semibold text-emerald-400">
                                                {formatPrice(order.total)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_LABELS[order.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                                                {STATUS_LABELS[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-300">
                                                {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link
                                                href={`/admin/pedidos/${order._id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-sm rounded-lg transition-all border border-sky-500/30"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
