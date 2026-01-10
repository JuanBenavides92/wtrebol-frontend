'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Technician {
    _id: string;
    name: string;
}

export default function AppointmentFormPage() {
    const router = useRouter();
    const params = useParams();
    const appointmentId = params?.id as string;
    const isEditing = appointmentId && appointmentId !== 'nueva';

    const [formData, setFormData] = useState({
        type: 'maintenance',
        status: 'pending',
        customer: {
            name: '',
            email: '',
            phone: '',
            address: '',
            notes: ''
        },
        scheduledDate: '',
        startTime: '',
        endTime: '',
        duration: 90,
        technician: {
            id: '',
            name: ''
        },
        serviceDetails: {
            equipmentType: '',
            brand: '',
            model: '',
            issue: ''
        }
    });

    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [availableSlots, setAvailableSlots] = useState<{ start: string; end: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTechnicians();
        if (isEditing) {
            loadAppointment();
        }
    }, []);

    useEffect(() => {
        if (formData.scheduledDate && formData.type) {
            loadAvailableSlots();
        }
    }, [formData.scheduledDate, formData.type]);

    const loadTechnicians = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/technicians?active=true', {
                credentials: 'include'
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setTechnicians(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading technicians:', error);
        }
    };

    const loadAppointment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    const apt = result.data;
                    setFormData({
                        type: apt.type,
                        status: apt.status,
                        customer: apt.customer,
                        scheduledDate: apt.scheduledDate.split('T')[0],
                        startTime: apt.startTime,
                        endTime: apt.endTime,
                        duration: apt.duration,
                        technician: apt.technician || { id: '', name: '' },
                        serviceDetails: apt.serviceDetails || {}
                    });
                }
            }
        } catch (error) {
            console.error('Error loading appointment:', error);
            setError('Error al cargar la cita');
        } finally {
            setIsLoading(false);
        }
    };

    const loadAvailableSlots = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/public/available-slots?date=${formData.scheduledDate}&serviceType=${formData.type}`
            );
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setAvailableSlots(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading slots:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const url = isEditing
                ? `http://localhost:5000/api/appointments/${appointmentId}`
                : 'http://localhost:5000/api/appointments';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    createdBy: 'admin'
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                router.push('/admin/citas');
            } else {
                setError(result.message || 'Error al guardar la cita');
            }
        } catch (error) {
            console.error('Error saving appointment:', error);
            setError('Error al guardar la cita');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSlotSelect = (slot: { start: string; end: string }) => {
        setFormData({
            ...formData,
            startTime: slot.start,
            endTime: slot.end
        });
    };

    const handleTechnicianChange = (techId: string) => {
        const tech = technicians.find(t => t._id === techId);
        setFormData({
            ...formData,
            technician: tech ? { id: tech._id, name: tech.name } : { id: '', name: '' }
        });
    };

    const serviceDurations: Record<string, number> = {
        maintenance: 90,
        installation: 240,
        repair: 120,
        quotation: 45,
        emergency: 90,
        'deep-clean': 150,
        'gas-refill': 60
    };

    const handleTypeChange = (type: string) => {
        const duration = serviceDurations[type] || 90;
        setFormData({
            ...formData,
            type,
            duration
        });
    };

    if (isLoading && isEditing) {
        return (
            <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                <p className="mt-4">Cargando cita...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => router.push('/admin/citas')}
                    className="text-sky-500 hover:text-sky-600 mb-4"
                >
                    ← Volver a citas
                </button>
                <h1 className="text-3xl font-bold">
                    {isEditing ? 'Editar Cita' : 'Nueva Cita'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {/* Tipo de Servicio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Servicio *
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                    >
                        <option value="maintenance">Mantenimiento (90 min)</option>
                        <option value="installation">Instalación (240 min)</option>
                        <option value="repair">Reparación (120 min)</option>
                        <option value="quotation">Cotización (45 min)</option>
                        <option value="emergency">Emergencia (90 min)</option>
                        <option value="deep-clean">Limpieza Profunda (150 min)</option>
                        <option value="gas-refill">Recarga de Gas (60 min)</option>
                    </select>
                </div>

                {/* Estado */}
                {isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="in-progress">En Progreso</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                    </div>
                )}

                {/* Información del Cliente */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={formData.customer.name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    customer: { ...formData.customer, name: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                value={formData.customer.phone}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    customer: { ...formData.customer, phone: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.customer.email}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    customer: { ...formData.customer, email: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dirección *
                            </label>
                            <input
                                type="text"
                                value={formData.customer.address}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    customer: { ...formData.customer, address: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas
                            </label>
                            <textarea
                                value={formData.customer.notes}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    customer: { ...formData.customer, notes: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Fecha y Hora */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-semibold mb-4">Fecha y Hora</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha *
                            </label>
                            <input
                                type="date"
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Técnico
                            </label>
                            <select
                                value={formData.technician.id}
                                onChange={(e) => handleTechnicianChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="">Sin asignar</option>
                                {technicians.map(tech => (
                                    <option key={tech._id} value={tech._id}>
                                        {tech.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Slots Disponibles */}
                    {availableSlots.length > 0 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Horarios Disponibles
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {availableSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSlotSelect(slot)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${formData.startTime === slot.start
                                                ? 'bg-sky-500 text-white border-sky-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-sky-500'
                                            }`}
                                    >
                                        {slot.start} - {slot.end}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Detalles del Servicio */}
                <div className="border-t pt-6">
                    <h2 className="text-lg font-semibold mb-4">Detalles del Servicio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Equipo
                            </label>
                            <input
                                type="text"
                                value={formData.serviceDetails.equipmentType || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    serviceDetails: { ...formData.serviceDetails, equipmentType: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Ej: Split, Central, Ventana"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Marca
                            </label>
                            <input
                                type="text"
                                value={formData.serviceDetails.brand || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    serviceDetails: { ...formData.serviceDetails, brand: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Ej: LG, Samsung, Carrier"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Modelo
                            </label>
                            <input
                                type="text"
                                value={formData.serviceDetails.model || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    serviceDetails: { ...formData.serviceDetails, model: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Ej: Inverter 12000 BTU"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Problema / Descripción
                            </label>
                            <textarea
                                value={formData.serviceDetails.issue || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    serviceDetails: { ...formData.serviceDetails, issue: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                rows={3}
                                placeholder="Describe el problema o requerimiento"
                            />
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/citas')}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Cita' : 'Crear Cita'}
                    </button>
                </div>
            </form>
        </div>
    );
}
