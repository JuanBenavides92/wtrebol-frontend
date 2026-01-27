'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Loader2, MapPin, Wrench, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import API_CONFIG from '@/lib/config';

interface Appointment {
    _id: string;
    type: 'maintenance' | 'installation' | 'repair' | 'quotation' | 'emergency' | 'deep-clean' | 'gas-refill';
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    scheduledDate: string;
    startTime: string;
    endTime: string;
    technician?: {
        name: string;
    };
    serviceDetails?: {
        equipmentType?: string;
        brand?: string;
        model?: string;
        issue?: string;
    };
    createdAt: string;
}

const SERVICE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
    maintenance: { label: 'Mantenimiento', icon: Wrench, color: 'text-blue-400' },
    installation: { label: 'Instalación', icon: Wrench, color: 'text-emerald-400' },
    repair: { label: 'Reparación', icon: Wrench, color: 'text-orange-400' },
    quotation: { label: 'Cotización', icon: Wrench, color: 'text-purple-400' },
    emergency: { label: 'Emergencia', icon: AlertCircle, color: 'text-red-400' },
    'deep-clean': { label: 'Limpieza Profunda', icon: Wrench, color: 'text-cyan-400' },
    'gas-refill': { label: 'Recarga de Gas', icon: Wrench, color: 'text-sky-400' }
};

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
    confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle },
    'in-progress': { label: 'En Progreso', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Clock },
    completed: { label: 'Completada', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
    cancelled: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
    'no-show': { label: 'No Asistió', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: XCircle }
};

export default function CustomerAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.MY_APPOINTMENTS), {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setAppointments(data.appointments);
                }
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAppointments = filterStatus === 'all'
        ? appointments
        : appointments.filter(apt => apt.status === filterStatus);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Mis Citas</h1>
                <p className="text-gray-400">Revisa el estado de tus citas agendadas</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterStatus === 'all'
                            ? 'bg-sky-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    Todas ({appointments.length})
                </button>
                {Object.entries(STATUS_LABELS).map(([status, { label }]) => {
                    const count = appointments.filter(a => a.status === status).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
                <div className="text-center py-20">
                    <Calendar className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {filterStatus === 'all' ? 'No tienes citas agendadas' : 'No hay citas con este estado'}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {filterStatus === 'all' ? 'Agenda una cita para nuestros servicios' : 'Prueba con otro filtro'}
                    </p>
                    {filterStatus === 'all' && (
                        <a
                            href="/servicios"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-lg hover:from-sky-400 hover:to-emerald-400 transition-all"
                        >
                            Agendar Cita
                        </a>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map((appointment) => {
                        const serviceInfo = SERVICE_LABELS[appointment.type] || { label: appointment.type, icon: Wrench, color: 'text-gray-400' };
                        const statusInfo = STATUS_LABELS[appointment.status] || { label: appointment.status, color: 'bg-gray-500/20 text-gray-400', icon: Clock };
                        const ServiceIcon = serviceInfo.icon;
                        const StatusIcon = statusInfo.icon;

                        return (
                            <div
                                key={appointment._id}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className={`p-2 rounded-lg bg-white/5 ${serviceInfo.color}`}>
                                                <ServiceIcon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-bold text-white">
                                                        {serviceInfo.label}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusInfo.color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>

                                                {/* Date and Time */}
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-sky-500" />
                                                        <span className="capitalize">{formatDate(appointment.scheduledDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-emerald-500" />
                                                        <span>{appointment.startTime} - {appointment.endTime}</span>
                                                    </div>
                                                </div>

                                                {/* Address */}
                                                <div className="flex items-start gap-2 text-sm text-gray-400 mb-3">
                                                    <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                                    <span>{appointment.customer.address}</span>
                                                </div>

                                                {/* Service Details */}
                                                {appointment.serviceDetails && (
                                                    <div className="bg-white/5 rounded-lg p-3 mt-3">
                                                        <p className="text-xs font-semibold text-gray-400 mb-2">Detalles del Servicio</p>
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            {appointment.serviceDetails.equipmentType && (
                                                                <div>
                                                                    <span className="text-gray-500">Equipo:</span>
                                                                    <span className="text-white ml-2">{appointment.serviceDetails.equipmentType}</span>
                                                                </div>
                                                            )}
                                                            {appointment.serviceDetails.brand && (
                                                                <div>
                                                                    <span className="text-gray-500">Marca:</span>
                                                                    <span className="text-white ml-2">{appointment.serviceDetails.brand}</span>
                                                                </div>
                                                            )}
                                                            {appointment.serviceDetails.model && (
                                                                <div className="col-span-2">
                                                                    <span className="text-gray-500">Modelo:</span>
                                                                    <span className="text-white ml-2">{appointment.serviceDetails.model}</span>
                                                                </div>
                                                            )}
                                                            {appointment.serviceDetails.issue && (
                                                                <div className="col-span-2">
                                                                    <span className="text-gray-500">Problema:</span>
                                                                    <span className="text-white ml-2">{appointment.serviceDetails.issue}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Technician */}
                                                {appointment.technician && (
                                                    <div className="mt-3 flex items-center gap-2 text-sm">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                                                            {appointment.technician.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Técnico Asignado</p>
                                                            <p className="text-white font-medium">{appointment.technician.name}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
