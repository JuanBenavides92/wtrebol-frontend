'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Award } from 'lucide-react';

interface Advantage {
    _id: string;
    type: 'advantage';
    title: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    order?: number;
    data?: {
        icon?: string;
        gradient?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export default function AdvantagesPage() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();
    const [advantages, setAdvantages] = useState<Advantage[]>([]);
    const [isLoadingAdvantages, setIsLoadingAdvantages] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadAdvantages();
        }
    }, [isAuthenticated]);

    const loadAdvantages = async () => {
        setIsLoadingAdvantages(true);
        try {
            const response = await fetch('http://localhost:5000/api/content/advantage', {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    // Ordenar por campo order
                    const sorted = result.data.sort((a: Advantage, b: Advantage) => (a.order || 0) - (b.order || 0));
                    setAdvantages(sorted);
                } else {
                    console.warn('Backend response format unexpected:', result);
                    setAdvantages([]);
                }
            }
        } catch (error) {
            console.error('Error loading advantages:', error);
        } finally {
            setIsLoadingAdvantages(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`http://localhost:5000/api/content/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (response.ok) loadAdvantages();
        } catch (error) {
            console.error('Error toggling advantage:', error);
        }
    };

    const deleteAdvantage = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta ventaja?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/content/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) loadAdvantages();
        } catch (error) {
            console.error('Error deleting advantage:', error);
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Ventajas Competitivas</h1>
                    <p className="text-gray-400">Gestiona las ventajas de "¿Por Qué Elegirnos?"</p>
                </div>
                <button
                    onClick={() => router.push('/admin/ventajas/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Nueva Ventaja
                </button>
            </div>

            {isLoadingAdvantages ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                </div>
            ) : advantages.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 border border-white/10 rounded-xl">
                    <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay ventajas</h3>
                    <p className="text-gray-400 mb-6">Crea tu primera ventaja competitiva</p>
                    <button
                        onClick={() => router.push('/admin/ventajas/new')}
                        className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Crear Ventaja
                    </button>
                </div>
            ) : (
                <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orden</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Icono</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Título</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Descripción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {advantages.map((advantage) => (
                                <tr key={advantage._id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-mono text-sm">#{advantage.order || 0}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${advantage.data?.gradient || 'from-sky-400 to-blue-500'} flex items-center justify-center text-2xl`}>
                                            {advantage.data?.icon === 'Award' && '🏆'}
                                            {advantage.data?.icon === 'Zap' && '⚡'}
                                            {advantage.data?.icon === 'Shield' && '🛡️'}
                                            {advantage.data?.icon === 'Wrench' && '🔧'}
                                            {advantage.data?.icon === 'DollarSign' && '💰'}
                                            {advantage.data?.icon === 'Smartphone' && '📱'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{advantage.title}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-400 text-sm line-clamp-2 max-w-md">
                                            {advantage.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActive(advantage._id, advantage.isActive)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${advantage.isActive
                                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                                }`}
                                        >
                                            {advantage.isActive ? <><Eye className="h-4 w-4" />Activo</> : <><EyeOff className="h-4 w-4" />Inactivo</>}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/admin/ventajas/${advantage._id}`)}
                                                className="p-2 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteAdvantage(advantage._id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Eliminar"
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

            {advantages.length > 0 && (
                <div className="mt-6 p-4 bg-slate-800/30 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Total: {advantages.length} {advantages.length === 1 ? 'ventaja' : 'ventajas'}</span>
                        <span className="text-gray-400">Activas: {advantages.filter(a => a.isActive).length}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
