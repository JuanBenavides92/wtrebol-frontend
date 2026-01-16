'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Loader2, HelpCircle } from 'lucide-react';

interface FAQ {
    _id: string;
    title: string;
    description?: string;
    isActive: boolean;
    order?: number;
    data?: {
        icon?: string;
        category?: string;
    };
}

export default function FAQsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
            return;
        }
        loadFAQs();
    }, [isAuthenticated]);

    const loadFAQs = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/content/faq', {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.success ? result.data : result;
                setFaqs(Array.isArray(data) ? data.sort((a, b) => (a.order || 0) - (b.order || 0)) : []);
            } else {
                setError('Error al cargar las FAQs');
            }
        } catch (error) {
            console.error('Error loading FAQs:', error);
            setError('Error al cargar las FAQs');
        } finally {
            setLoading(false);
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

            if (response.ok) {
                loadFAQs();
            } else {
                setError('Error al actualizar el estado');
            }
        } catch (error) {
            console.error('Error toggling FAQ:', error);
            setError('Error al actualizar el estado');
        }
    };

    const deleteFAQ = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta FAQ?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/content/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                loadFAQs();
            } else {
                setError('Error al eliminar la FAQ');
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            setError('Error al eliminar la FAQ');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    const activeFAQs = faqs.filter(f => f.isActive).length;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <HelpCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Preguntas Frecuentes</h1>
                        <p className="text-gray-400">Gestiona las FAQs de tu sitio web</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">Total FAQs</div>
                    <div className="text-3xl font-bold text-white">{faqs.length}</div>
                </div>
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">FAQs Activas</div>
                    <div className="text-3xl font-bold text-green-400">{activeFAQs}</div>
                </div>
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-1">FAQs Inactivas</div>
                    <div className="text-3xl font-bold text-red-400">{faqs.length - activeFAQs}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/admin/faqs/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus className="h-5 w-5" />
                    Nueva FAQ
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/50 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Orden
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Icono
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Pregunta
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {faqs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No hay FAQs registradas. Crea una nueva para comenzar.
                                    </td>
                                </tr>
                            ) : (
                                faqs.map((faq) => (
                                    <tr key={faq._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-300">{faq.order || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl">{faq.data?.icon || '❓'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white max-w-md truncate">
                                                {faq.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {faq.data?.category && (
                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
                                                    {faq.data.category}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleActive(faq._id, faq.isActive)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${faq.isActive
                                                        ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                                        : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                                    }`}
                                            >
                                                {faq.isActive ? 'Activa' : 'Inactiva'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/faqs/${faq._id}`)}
                                                    className="p-2 text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteFAQ(faq._id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
