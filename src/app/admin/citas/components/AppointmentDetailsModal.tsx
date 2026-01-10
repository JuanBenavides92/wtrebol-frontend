'use client';

import { useState, useEffect } from 'react';

interface AppointmentDetailsModalProps {
    isOpen: boolean;
    appointment: any;
    onClose: () => void;
    onUpdate: (appointmentId: string, updates: any) => void;
    onDelete: (appointmentId: string) => void;
}

const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: '#F59E0B', icon: '⏳' },
    { value: 'confirmed', label: 'Confirmada', color: '#3B82F6', icon: '✓' },
    { value: 'in-progress', label: 'En Progreso', color: '#A855F7', icon: '🔧' },
    { value: 'completed', label: 'Completada', color: '#10B981', icon: '✅' },
    { value: 'cancelled', label: 'Cancelada', color: '#EF4444', icon: '❌' },
    { value: 'no-show', label: 'No Asistió', color: '#6B7280', icon: '👻' }
];

const typeLabels: Record<string, string> = {
    maintenance: 'Mantenimiento',
    installation: 'Instalación',
    repair: 'Reparación',
    quotation: 'Cotización',
    emergency: 'Emergencia',
    'deep-clean': 'Limpieza Profunda',
    'gas-refill': 'Recarga de Gas'
};

export default function AppointmentDetailsModal({
    isOpen,
    appointment,
    onClose,
    onUpdate,
    onDelete
}: AppointmentDetailsModalProps) {
    const [editedStatus, setEditedStatus] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [editedStartTime, setEditedStartTime] = useState('');
    const [editedEndTime, setEditedEndTime] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // Inicializar valores cuando se abre el modal
    useEffect(() => {
        if (appointment && isOpen) {
            setEditedStatus(appointment.status || 'pending');
            setEditedDate(appointment.scheduledDate?.split('T')[0] || '');
            setEditedStartTime(appointment.startTime || '');
            setEditedEndTime(appointment.endTime || '');
            setHasChanges(false);
        }
    }, [appointment, isOpen]);

    // Detectar cambios
    useEffect(() => {
        if (appointment) {
            const changed =
                editedStatus !== appointment.status ||
                editedDate !== appointment.scheduledDate?.split('T')[0] ||
                editedStartTime !== appointment.startTime ||
                editedEndTime !== appointment.endTime;
            setHasChanges(changed);
        }
    }, [editedStatus, editedDate, editedStartTime, editedEndTime, appointment]);

    if (!isOpen || !appointment) return null;

    const currentStatus = statusOptions.find(s => s.value === editedStatus);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSaveChanges = () => {
        const updates: any = {};

        if (editedStatus !== appointment.status) {
            updates.status = editedStatus;
        }
        if (editedDate !== appointment.scheduledDate?.split('T')[0]) {
            updates.scheduledDate = editedDate;
        }
        if (editedStartTime !== appointment.startTime) {
            updates.startTime = editedStartTime;
        }
        if (editedEndTime !== appointment.endTime) {
            updates.endTime = editedEndTime;
        }

        if (Object.keys(updates).length > 0) {
            onUpdate(appointment._id, updates);
        }
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            onDelete(appointment._id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: currentStatus?.color }}
                        ></div>
                        <h2 className="text-2xl font-bold text-gray-900">Detalles de la Cita</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Cliente */}
                    <div className="bg-sky-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-sky-900 mb-3">👤 Cliente</h3>
                        <div className="space-y-2">
                            <p className="text-gray-900 font-medium text-lg">{appointment.customer.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>📧</span>
                                <span>{appointment.customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>📱</span>
                                <span>{appointment.customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>📍</span>
                                <span>{appointment.customer.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tipo de Servicio (solo lectura) */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Tipo de Servicio</p>
                        <p className="text-gray-900 font-medium">{typeLabels[appointment.type]}</p>
                    </div>

                    {/* Fecha y Horario - Editables */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="text-xs text-gray-500 block mb-2">Fecha</label>
                            <input
                                type="date"
                                value={editedDate}
                                onChange={(e) => setEditedDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="text-xs text-gray-500 block mb-2">Duración</label>
                            <p className="text-gray-900 font-medium py-2">{appointment.duration} minutos</p>
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="text-xs text-gray-500 block mb-2">Hora Inicio</label>
                            <input
                                type="time"
                                value={editedStartTime}
                                onChange={(e) => setEditedStartTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="text-xs text-gray-500 block mb-2">Hora Fin</label>
                            <input
                                type="time"
                                value={editedEndTime}
                                onChange={(e) => setEditedEndTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Estado - Selector */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-xs text-gray-500 block mb-3">Estado</label>
                        <div className="grid grid-cols-2 gap-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => setEditedStatus(status.value)}
                                    className={`
                                        px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium text-left
                                        ${editedStatus === status.value
                                            ? 'border-sky-500 bg-sky-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{status.icon}</span>
                                        <span>{status.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Técnico */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Técnico Asignado</p>
                        <p className="text-gray-900 font-medium">
                            {appointment.technician?.name || 'Sin asignar'}
                        </p>
                    </div>

                    {/* Notas */}
                    {appointment.notes && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-2">Notas</p>
                            <p className="text-gray-700 text-sm whitespace-pre-line">{appointment.notes}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                        Eliminar Cita
                    </button>
                    <div className="flex-1"></div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        disabled={!hasChanges}
                        className={`px-6 py-2 rounded-lg transition-colors font-medium ${hasChanges
                                ? 'bg-sky-500 text-white hover:bg-sky-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
