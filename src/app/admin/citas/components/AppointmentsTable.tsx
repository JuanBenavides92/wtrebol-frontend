'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import API_CONFIG from '@/lib/config';
import {
    Filter,
    Calendar,
    Clock,
    User,
    Phone,
    Edit,
    Trash2,
    Loader2,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    XCircle
} from 'lucide-react';

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

const statusConfig: Record<string, { label: string; color: string; gradient: string; icon: any }> = {
    pending: {
        label: 'Pendiente',
        color: 'text-amber-400',
        gradient: 'from-amber-500/20 to-orange-500/20',
        icon: Clock
    },
    confirmed: {
        label: 'Confirmada',
        color: 'text-sky-400',
        gradient: 'from-sky-500/20 to-blue-500/20',
        icon: CheckCircle
    },
    'in-progress': {
        label: 'En Progreso',
        color: 'text-purple-400',
        gradient: 'from-purple-500/20 to-pink-500/20',
        icon: TrendingUp
    },
    completed: {
        label: 'Completada',
        color: 'text-emerald-400',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        icon: CheckCircle
    },
    cancelled: {
        label: 'Cancelada',
        color: 'text-red-400',
        gradient: 'from-red-500/20 to-pink-500/20',
        icon: XCircle
    },
    'no-show': {
        label: 'No Asistió',
        color: 'text-slate-400',
        gradient: 'from-slate-500/20 to-gray-500/20',
        icon: AlertCircle
    }
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

            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}?${params}`), {
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
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`), {
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

    const stats = [
        {
            label: 'Total Citas',
            value: appointments.length,
            gradient: 'from-sky-500 to-blue-600',
            bgGradient: 'from-sky-500/10 to-blue-600/10',
            borderColor: 'border-sky-500/20'
        },
        {
            label: 'Pendientes',
            value: appointments.filter(a => a.status === 'pending').length,
            gradient: 'from-amber-500 to-orange-600',
            bgGradient: 'from-amber-500/10 to-orange-600/10',
            borderColor: 'border-amber-500/20'
        },
        {
            label: 'Confirmadas',
            value: appointments.filter(a => a.status === 'confirmed').length,
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-500/10 to-teal-600/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            label: 'Completadas',
            value: appointments.filter(a => a.status === 'completed').length,
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-500/10 to-pink-600/10',
            borderColor: 'border-purple-500/20'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-sky-400" />
                    <h3 className="text-lg font-semibold text-white">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Estado
                        </label>
                        <select
                            value={filter.status}
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Tipo de Servicio
                        </label>
                        <select
                            value={filter.type}
                            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Fecha
                        </label>
                        <input
                            type="date"
                            value={filter.date}
                            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group relative"
                    >
                        <div className={`
                            h-full bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm
                            border ${stat.borderColor} rounded-2xl p-6
                            transition-all duration-300 shadow-lg hover:shadow-2xl
                        `}>
                            <p className="text-sm font-medium text-slate-400 mb-2">{stat.label}</p>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lista de Citas */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
                </div>
            ) : appointments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center"
                >
                    <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-4">No hay citas registradas</p>
                    <button
                        onClick={() => router.push('/admin/citas/nueva')}
                        className="text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        Crear primera cita
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Servicio
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Fecha y Hora
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Técnico
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {appointments.map((appointment, index) => {
                                    const statusInfo = statusConfig[appointment.status];
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <motion.tr
                                            key={appointment._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {appointment.customer.name}
                                                        </div>
                                                        <div className="text-sm text-slate-400 flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {appointment.customer.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white">
                                                    {typeLabels[appointment.type]}
                                                </div>
                                                <div className="text-sm text-slate-400">
                                                    {appointment.duration} min
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-sky-400" />
                                                    {formatDate(appointment.scheduledDate)}
                                                </div>
                                                <div className="text-sm text-slate-400 flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-emerald-400" />
                                                    {appointment.startTime} - {appointment.endTime}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`
                                                    inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                                                    bg-gradient-to-r ${statusInfo.gradient}
                                                    border border-white/10
                                                `}>
                                                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                                    <span className={`text-sm font-medium ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                {appointment.technician?.name || 'Sin asignar'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/citas/${appointment._id}`)}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/50 transition-all group/btn"
                                                    >
                                                        <Edit className="w-4 h-4 text-slate-400 group-hover/btn:text-sky-400 transition-colors" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(appointment._id)}
                                                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all group/btn"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-slate-400 group-hover/btn:text-red-400 transition-colors" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
