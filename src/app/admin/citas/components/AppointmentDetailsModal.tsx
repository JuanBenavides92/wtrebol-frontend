'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Calendar, Clock, Wrench, Trash2, Save } from 'lucide-react';

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

    useEffect(() => {
        if (appointment && isOpen) {
            setEditedStatus(appointment.status || 'pending');
            setEditedDate(appointment.scheduledDate?.split('T')[0] || '');
            setEditedStartTime(appointment.startTime || '');
            setEditedEndTime(appointment.endTime || '');
            setHasChanges(false);
        }
    }, [appointment, isOpen]);

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
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full shadow-lg"
                                    style={{ backgroundColor: currentStatus?.color, boxShadow: `0 0 10px ${currentStatus?.color}50` }}
                                />
                                <h2 className="text-2xl font-bold text-white">Detalles de la Cita</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group"
                            >
                                <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {/* Cliente */}
                            <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5 text-sky-400" />
                                    <h3 className="text-sm font-semibold text-sky-300">Cliente</h3>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-white font-medium text-lg">{appointment.customer.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Mail className="w-4 h-4 text-sky-400" />
                                        <span>{appointment.customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Phone className="w-4 h-4 text-sky-400" />
                                        <span>{appointment.customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <MapPin className="w-4 h-4 text-sky-400" />
                                        <span>{appointment.customer.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tipo de Servicio */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wrench className="w-4 h-4 text-purple-400" />
                                    <p className="text-xs text-slate-400">Tipo de Servicio</p>
                                </div>
                                <p className="text-white font-medium">{typeLabels[appointment.type]}</p>
                            </div>

                            {/* Fecha y Horario - Editables */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-emerald-400" />
                                        <label className="text-xs text-slate-400">Fecha</label>
                                    </div>
                                    <input
                                        type="date"
                                        value={editedDate}
                                        onChange={(e) => setEditedDate(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-orange-400" />
                                        <label className="text-xs text-slate-400">Duración</label>
                                    </div>
                                    <p className="text-white font-medium py-2">{appointment.duration} minutos</p>
                                </div>
                            </div>

                            {/* Horarios */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <label className="text-xs text-slate-400 block mb-2">Hora Inicio</label>
                                    <input
                                        type="time"
                                        value={editedStartTime}
                                        onChange={(e) => setEditedStartTime(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <label className="text-xs text-slate-400 block mb-2">Hora Fin</label>
                                    <input
                                        type="time"
                                        value={editedEndTime}
                                        onChange={(e) => setEditedEndTime(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Estado - Selector */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <label className="text-xs text-slate-400 block mb-3">Estado</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status.value}
                                            type="button"
                                            onClick={() => setEditedStatus(status.value)}
                                            className={`
                                                px-3 py-2.5 rounded-lg border-2 transition-all text-sm font-medium text-left
                                                ${editedStatus === status.value
                                                    ? 'border-sky-500 bg-sky-500/20 text-white'
                                                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
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
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <p className="text-xs text-slate-400 mb-1">Técnico Asignado</p>
                                <p className="text-white font-medium">
                                    {appointment.technician?.name || 'Sin asignar'}
                                </p>
                            </div>

                            {/* Notas */}
                            {appointment.notes && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-slate-400 mb-2">Notas</p>
                                    <p className="text-slate-300 text-sm whitespace-pre-line">{appointment.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-slate-800/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2.5 border border-red-500/50 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all font-medium flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </button>
                            <div className="flex-1" />
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 border border-white/10 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-medium"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasChanges}
                                className={`px-6 py-2.5 rounded-xl transition-all font-medium flex items-center gap-2 ${hasChanges
                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-sky-500/50'
                                        : 'bg-white/5 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <Save className="w-4 h-4" />
                                Guardar Cambios
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

