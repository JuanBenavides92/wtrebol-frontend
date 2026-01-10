'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Appointment {
    _id: string;
    type: string;
    status: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    scheduledDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    technician?: {
        id: string;
        name: string;
    };
    createdAt: string;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    'no-show': 'bg-gray-100 text-gray-800'
};

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    'in-progress': 'En Progreso',
    completed: 'Completada',
    cancelled: 'Cancelada',
    'no-show': 'No Asistió'
};

const typeLabels: Record<string, string> = {
    maintenance: 'Mantenimiento',
    installation: 'Instalación',
    repair: 'Reparación',
    quotation: 'Cotización',
    emergency: 'Emergencia',
    'deep-clean': 'Limpieza Profunda',
    'gas-refill': 'Recarga de Gas'
};

interface AppointmentsTableProps {
    onRefresh?: () => void;
}

export default function AppointmentsTable({ onRefresh }: AppointmentsTableProps) {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState({
        status: '',
        type: '',
        date: ''
    });

    useEffect(() => {
        loadAppointments();
    }, [filter]);

    const loadAppointments = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.status) params.append('status', filter.status);
            if (filter.type) params.append('type', filter.type);
            if (filter.date) params.append('date', filter.date);

            const response = await fetch(`http://localhost:5000/api/appointments?${params}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setAppointments(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta cita?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                loadAppointments();
                onRefresh?.();
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div>
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Todos</option>
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="in-progress">En Progreso</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Servicio
                        </label>
                        <select
                            value={filter.type}
                            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">Todos</option>
                            <option value="maintenance">Mantenimiento</option>
                            <option value="installation">Instalación</option>
                            <option value="repair">Reparación</option>
                            <option value="quotation">Cotización</option>
                            <option value="emergency">Emergencia</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha
                        </label>
                        <input
                            type="date"
                            value={filter.date}
                            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <p className="text-gray-500 text-sm">Total Citas</p>
                    <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <p className="text-gray-500 text-sm">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {appointments.filter(a => a.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <p className="text-gray-500 text-sm">Confirmadas</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {appointments.filter(a => a.status === 'confirmed').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <p className="text-gray-500 text-sm">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">
                        {appointments.filter(a => a.status === 'completed').length}
                    </p>
                </div>
            </div>

            {/* Lista de Citas */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                    <p className="mt-4 text-gray-600">Cargando citas...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No hay citas registradas</p>
                    <button
                        onClick={() => router.push('/admin/citas/nueva')}
                        className="mt-4 text-sky-500 hover:text-sky-600"
                    >
                        Crear primera cita
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Servicio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha y Hora
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Técnico
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {appointment.customer.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {appointment.customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {typeLabels[appointment.type]}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {appointment.duration} min
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(appointment.scheduledDate)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {appointment.startTime} - {appointment.endTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appointment.status]}`}>
                                            {statusLabels[appointment.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {appointment.technician?.name || 'Sin asignar'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => router.push(`/admin/citas/${appointment._id}`)}
                                            className="text-sky-600 hover:text-sky-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(appointment._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
