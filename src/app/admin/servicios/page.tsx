'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Wrench } from 'lucide-react';

interface Service {
    _id: string;
    type: 'service';
    title: string;
    description?: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ServicesPage() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadServices();
        }
    }, [isAuthenticated]);

    const loadServices = async () => {
        setIsLoadingServices(true);
        try {
            const response = await fetch('http://localhost:5000/api/content/service', {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                // Backend devuelve { success: true, count: N, data: [...] }
                if (result.success && Array.isArray(result.data)) {
                    setServices(result.data);
                } else {
                    console.warn('Backend response format unexpected:', result);
                    setServices([]);
                }
            }
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setIsLoadingServices(false);
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

            if (response.ok) loadServices();
        } catch (error) {
            console.error('Error toggling service:', error);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/content/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) loadServices();
        } catch (error) {
            console.error('Error deleting service:', error);
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
                    <h1 className="text-3xl font-bold text-white mb-2">Servicios</h1>
                    <p className="text-gray-400">Gestiona los servicios ofrecidos</p>
                </div>
                <button
                    onClick={() => router.push('/admin/servicios/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Servicio
                </button>
            </div>

            {isLoadingServices ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 border border-white/10 rounded-xl">
                    <Wrench className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay servicios</h3>
                    <p className="text-gray-400 mb-6">Crea tu primer servicio</p>
                    <button
                        onClick={() => router.push('/admin/servicios/new')}
                        className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Crear Servicio
                    </button>
                </div>
            ) : (
                <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Imagen</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nombre</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Descripción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {services.map((service) => (
                                <tr key={service._id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                                            <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{service.title}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-400 text-sm line-clamp-2 max-w-md">
                                            {service.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActive(service._id, service.isActive)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${service.isActive
                                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                                }`}
                                        >
                                            {service.isActive ? <><Eye className="h-4 w-4" />Activo</> : <><EyeOff className="h-4 w-4" />Inactivo</>}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/admin/servicios/${service._id}`)}
                                                className="p-2 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteService(service._id)}
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

            {services.length > 0 && (
                <div className="mt-6 p-4 bg-slate-800/30 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Total: {services.length} {services.length === 1 ? 'servicio' : 'servicios'}</span>
                        <span className="text-gray-400">Activos: {services.filter(s => s.isActive).length}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
