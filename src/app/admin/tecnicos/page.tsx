'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API_CONFIG from '@/lib/config';

interface Technician {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialties: string[];
    isActive: boolean;
    stats: {
        totalAppointments: number;
        completedAppointments: number;
    };
}

const specialtyLabels: Record<string, string> = {
    maintenance: 'Mantenimiento',
    installation: 'Instalación',
    repair: 'Reparación',
    quotation: 'Cotización',
    emergency: 'Emergencia',
    'deep-clean': 'Limpieza Profunda',
    'gas-refill': 'Recarga de Gas'
};

export default function TechniciansPage() {
    const router = useRouter();
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTechnicians();
    }, []);

    const loadTechnicians = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.TECHNICIANS), {
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setTechnicians(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading technicians:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este técnico?')) return;

        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TECHNICIANS}/${id}`), {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                loadTechnicians();
            }
        } catch (error) {
            console.error('Error deleting technician:', error);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TECHNICIANS}/${id}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (response.ok) {
                loadTechnicians();
            }
        } catch (error) {
            console.error('Error updating technician:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Técnicos</h1>
                <button
                    onClick={() => router.push('/admin/tecnicos/nuevo')}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    + Nuevo Técnico
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                    <p className="mt-4 text-gray-600">Cargando técnicos...</p>
                </div>
            ) : technicians.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No hay técnicos registrados</p>
                    <button
                        onClick={() => router.push('/admin/tecnicos/nuevo')}
                        className="mt-4 text-sky-500 hover:text-sky-600"
                    >
                        Crear primer técnico
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {technicians.map((tech) => (
                        <div key={tech._id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                                    <p className="text-sm text-gray-500">{tech.email}</p>
                                    <p className="text-sm text-gray-500">{tech.phone}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tech.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {tech.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
                                <div className="flex flex-wrap gap-1">
                                    {tech.specialties.map((spec, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full"
                                        >
                                            {specialtyLabels[spec] || spec}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500">Total Citas</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {tech.stats.totalAppointments}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Completadas</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {tech.stats.completedAppointments}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/admin/tecnicos/${tech._id}`)}
                                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => toggleActive(tech._id, tech.isActive)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    {tech.isActive ? 'Desactivar' : 'Activar'}
                                </button>
                                <button
                                    onClick={() => handleDelete(tech._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

