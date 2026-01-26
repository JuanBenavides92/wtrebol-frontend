'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Eye, Trash2, Loader2, UserPlus, ShoppingCart, DollarSign } from 'lucide-react';
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
    ordersCount: number;
    createdAt: string;
}

interface Stats {
    totalCustomers: number;
    customersThisWeek: number;
    customersWithOrders: number;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCustomers();
        fetchStats();
    }, [searchQuery]);

    const fetchCustomers = async () => {
        try {
            let url = API_CONFIG.url(API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS);
            if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;

            const response = await fetch(url, { credentials: 'include' });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCustomers(data.customers);
                }
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS_STATS), {
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

    const handleDeleteCustomer = async (customerId: string, customerName: string) => {
        if (!confirm(`¿Estás seguro de eliminar al cliente "${customerName}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ADMIN_CUSTOMERS}/${customerId}`),
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Cliente eliminado correctamente');
                fetchCustomers();
                fetchStats();
            } else {
                alert(data.message || 'Error al eliminar cliente');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error al eliminar cliente');
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
                <h1 className="text-3xl font-bold text-white mb-2">Gestión de Clientes</h1>
                <p className="text-gray-400">Administra la base de datos de clientes</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-sky-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
                        <p className="text-sm text-gray-400">Total Clientes</p>
                    </div>

                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.customersWithOrders}</p>
                        <p className="text-sm text-gray-400">Con Pedidos</p>
                    </div>

                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                <UserPlus className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.customersThisWeek}</p>
                        <p className="text-sm text-gray-400">Esta Semana</p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                {customers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No hay clientes</h2>
                        <p className="text-gray-400">
                            {searchQuery
                                ? 'No se encontraron clientes con la búsqueda actual'
                                : 'Aún no hay clientes registrados'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Contacto
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Ubicación
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Pedidos
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Registro
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {customers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-white">{customer.name}</p>
                                            <p className="text-sm text-gray-400">{customer.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">{customer.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.address ? (
                                                <>
                                                    <p className="text-sm text-gray-300">{customer.city}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-xs">
                                                        {customer.address}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-500">No especificado</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${customer.ordersCount > 0
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                <ShoppingCart className="h-4 w-4" />
                                                {customer.ordersCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">
                                                {new Date(customer.createdAt).toLocaleDateString('es-ES')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/clientes/${customer._id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-sm rounded-lg transition-all border border-sky-500/30"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Ver
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer._id, customer.name)}
                                                    disabled={customer.ordersCount > 0}
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
                                                    title={customer.ordersCount > 0 ? 'No se puede eliminar un cliente con pedidos' : 'Eliminar cliente'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
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
