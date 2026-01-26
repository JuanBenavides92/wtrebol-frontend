'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Eye, Trash2, Loader2, UserPlus, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';
import API_CONFIG from '@/lib/config';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    usersByRole: Array<{
        _id: string;
        count: number;
    }>;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
    admin: { label: 'Administrador', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    manager: { label: 'Gerente', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    editor: { label: 'Editor', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    viewer: { label: 'Visualizador', color: 'bg-gray-500/20 text-gray-400' }
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [searchQuery]);

    const fetchUsers = async () => {
        try {
            let url = API_CONFIG.url(API_CONFIG.ENDPOINTS.ADMIN_USERS);
            if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;

            const response = await fetch(url, { credentials: 'include' });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUsers(data.users);
                }
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.ADMIN_USERS_STATS), {
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

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`¿Estás seguro de eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/${userId}`),
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Usuario eliminado correctamente');
                fetchUsers();
                fetchStats();
            } else {
                alert(data.message || 'Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error al eliminar usuario');
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
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h1>
                    <p className="text-gray-400">Administra usuarios y permisos del sistema</p>
                </div>
                <Link
                    href="/admin/usuarios/nuevo"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                    <UserPlus className="h-5 w-5" />
                    Nuevo Usuario
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-sky-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-400">Total Usuarios</p>
                    </div>

                    {stats.usersByRole.slice(0, 3).map((roleData) => {
                        const roleInfo = ROLE_LABELS[roleData._id];
                        if (!roleInfo) return null;
                        return (
                            <div key={roleData._id} className="bg-slate-800/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${roleInfo.color.replace('text-', 'bg-').replace('-400', '-500/20')} rounded-lg flex items-center justify-center`}>
                                        <Shield className="h-6 w-6" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-white">{roleData.count}</p>
                                <p className="text-sm text-gray-400">{roleInfo.label}s</p>
                            </div>
                        );
                    })}
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

            {/* Users Table */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                {users.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No hay usuarios</h2>
                        <p className="text-gray-400">
                            {searchQuery
                                ? 'No se encontraron usuarios con la búsqueda actual'
                                : 'Aún no hay usuarios registrados'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                        Rol
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
                                {users.map((user) => {
                                    const roleInfo = ROLE_LABELS[user.role];
                                    return (
                                        <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-semibold text-white">{user.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-300">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${roleInfo?.color || 'bg-gray-500/20 text-gray-400'}`}>
                                                    <Shield className="h-4 w-4" />
                                                    {roleInfo?.label || user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/usuarios/${user._id}`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-sm rounded-lg transition-all border border-sky-500/30"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-all border border-red-500/30"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
