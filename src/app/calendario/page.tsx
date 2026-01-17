'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import API_CONFIG from '@/lib/config';
import { CheckCircle2, Calendar, Clock, User } from 'lucide-react';

interface ServiceType {
    type: string;
    duration: number;
    color: string;
}

interface TimeSlot {
    start: string;
    end: string;
}

export default function CalendarioPage() {
    const [step, setStep] = useState(1);
    const [services, setServices] = useState<ServiceType[]>([]);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    const [formData, setFormData] = useState({
        type: '',
        scheduledDate: '',
        startTime: '',
        endTime: '',
        duration: 0,
        customer: {
            name: '',
            email: '',
            phone: '',
            address: '',
            notes: ''
        },
        serviceDetails: {
            equipmentType: '',
            brand: '',
            model: '',
            issue: ''
        }
    });

    const serviceLabels: Record<string, string> = {
        maintenance: 'Mantenimiento',
        installation: 'Instalación',
        repair: 'Reparación',
        quotation: 'Cotización',
        emergency: 'Emergencia',
        'deep-clean': 'Limpieza Profunda',
        'gas-refill': 'Recarga de Gas'
    };

    const serviceDescriptions: Record<string, string> = {
        maintenance: 'Mantenimiento preventivo y correctivo de equipos de climatización',
        installation: 'Instalación profesional de sistemas de aire acondicionado',
        repair: 'Reparación de fallas y averías en equipos',
        quotation: 'Cotización sin compromiso para tu proyecto',
        emergency: 'Servicio de emergencia 24/7',
        'deep-clean': 'Limpieza profunda de equipos y ductos',
        'gas-refill': 'Recarga de gas refrigerante'
    };

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        if (formData.type && formData.scheduledDate) {
            loadAvailableSlots();
        }
    }, [formData.type, formData.scheduledDate]);

    const loadServices = async () => {
        try {
            const response = await fetch(
                API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENT_TYPES)
            );
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setServices(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading services:', error);
        }
    };

    const loadAvailableSlots = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.AVAILABLE_SLOTS}?date=${formData.scheduledDate}&serviceType=${formData.type}`)
            );
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setAvailableSlots(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading slots:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleServiceSelect = (service: ServiceType) => {
        setFormData({
            ...formData,
            type: service.type,
            duration: service.duration
        });
        setStep(2);
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        setFormData({
            ...formData,
            startTime: slot.start,
            endTime: slot.end
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(
                API_CONFIG.url(API_CONFIG.ENDPOINTS.PUBLIC_APPOINTMENTS),
                API_CONFIG.fetchOptions({
                    method: 'POST',
                    body: JSON.stringify(formData)
                })
            );

            if (response.ok) {
                setBookingComplete(true);
            } else {
                alert('Error al agendar la cita. Por favor intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Error al agendar la cita. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    if (bookingComplete) {
        return (
            <>
                <PageLayout>
                    <div className="flex flex-col items-center justify-center min-h-96">
                        <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-6 animate-bounce" />
                        <h2 className="text-4xl font-bold text-white mb-4">¡Cita Agendada Exitosamente!</h2>
                        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 max-w-md">
                            <p className="text-gray-300 text-center mb-4">
                                Hemos recibido tu solicitud de cita para:
                            </p>
                            <div className="space-y-2 text-sky-200">
                                <p><strong>Servicio:</strong> {serviceLabels[formData.type]}</p>
                                <p><strong>Fecha:</strong> {new Date(formData.scheduledDate).toLocaleDateString('es-CO', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                                <p><strong>Hora:</strong> {formData.startTime}</p>
                            </div>
                            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                                <p className="text-blue-200 text-sm text-center">
                                    📧 Recibirás un email de confirmación en {formData.customer.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-colors"
                        >
                            Agendar Otra Cita
                        </button>
                    </div>
                </PageLayout>
                <Footer showFooter={true} isStatic={true} />
            </>
        );
    }

    return (
        <>
            <PageLayout>
                <h1 className="text-4xl font-bold text-sky-500 mb-2">Agendar Servicio</h1>
                <p className="text-gray-400 mb-8 text-lg">
                    Agenda tu cita en 3 simples pasos
                </p>

                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= s ? 'bg-sky-500 text-white' : 'bg-slate-700 text-gray-400'
                                    }`}>
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-sky-500' : 'bg-slate-700'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <Calendar className="mr-2" /> Selecciona el Servicio
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <button
                                    key={service.type}
                                    onClick={() => handleServiceSelect(service)}
                                    className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-sky-500/50 hover:bg-slate-800 transition-all text-left group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                                            {serviceLabels[service.type]}
                                        </h3>
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: service.color }}
                                        />
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {serviceDescriptions[service.type]}
                                    </p>
                                    <div className="flex items-center text-sky-400 text-sm">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {service.duration} minutos
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select Date & Time */}
                {step === 2 && (
                    <div>
                        <button
                            onClick={() => setStep(1)}
                            className="text-sky-400 hover:text-sky-300 mb-6"
                        >
                            ← Cambiar servicio
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <Clock className="mr-2" /> Selecciona Fecha y Hora
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Date Selection */}
                            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Fecha</h3>
                                <input
                                    type="date"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    min={getMinDate()}
                                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 text-white"
                                />
                            </div>

                            {/* Time Selection */}
                            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Horarios Disponibles</h3>
                                {!formData.scheduledDate ? (
                                    <p className="text-gray-400 text-sm">Selecciona una fecha primero</p>
                                ) : isLoading ? (
                                    <p className="text-gray-400 text-sm">Cargando horarios...</p>
                                ) : availableSlots.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No hay horarios disponibles para esta fecha</p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                        {availableSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSlotSelect(slot)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.startTime === slot.start
                                                    ? 'bg-sky-500 text-white'
                                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                    }`}
                                            >
                                                {slot.start}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {formData.startTime && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-colors"
                                >
                                    Continuar →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Customer Information */}
                {step === 3 && (
                    <div>
                        <button
                            onClick={() => setStep(2)}
                            className="text-sky-400 hover:text-sky-300 mb-6"
                        >
                            ← Cambiar fecha/hora
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <User className="mr-2" /> Tus Datos
                        </h2>

                        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-white font-medium mb-2">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        value={formData.customer.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            customer: { ...formData.customer, name: e.target.value }
                                        })}
                                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Teléfono *</label>
                                    <input
                                        type="tel"
                                        value={formData.customer.phone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            customer: { ...formData.customer, phone: e.target.value }
                                        })}
                                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.customer.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            customer: { ...formData.customer, email: e.target.value }
                                        })}
                                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Dirección *</label>
                                    <input
                                        type="text"
                                        value={formData.customer.address}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            customer: { ...formData.customer, address: e.target.value }
                                        })}
                                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-white font-medium mb-2">
                                    Describe el problema o requerimiento (opcional)
                                </label>
                                <textarea
                                    value={formData.serviceDetails.issue}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        serviceDetails: { ...formData.serviceDetails, issue: e.target.value }
                                    })}
                                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 text-white"
                                    rows={4}
                                    placeholder="Ej: El aire acondicionado no enfría correctamente..."
                                />
                            </div>

                            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                                <p className="text-blue-200 text-sm">
                                    📍 Una vez confirmes tu cita, recibirás un email de confirmación y nuestro equipo se pondrá en contacto contigo.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                                >
                                    {isLoading ? 'Agendando...' : 'Confirmar Cita'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </PageLayout>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}

