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
                <div className="min-h-screen bg-white">
                    <PageLayout>
                        <div className="flex flex-col items-center justify-center min-h-96 py-20">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-6 animate-bounce shadow-lg shadow-emerald-200/50">
                                <CheckCircle2 className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">¡Cita Agendada!</h2>
                            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 max-w-md shadow-xl shadow-slate-200/50">
                                <p className="text-slate-700 text-center mb-6 text-lg">
                                    Hemos recibido tu solicitud de cita para:
                                </p>
                                <div className="space-y-3 text-slate-700">
                                    <p className="flex items-center gap-2">
                                        <span className="font-bold text-sky-600">Servicio:</span>
                                        <span>{serviceLabels[formData.type]}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-bold text-sky-600">Fecha:</span>
                                        <span>{new Date(formData.scheduledDate).toLocaleDateString('es-CO', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-bold text-sky-600">Hora:</span>
                                        <span>{formData.startTime}</span>
                                    </p>
                                </div>
                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl">
                                    <p className="text-blue-700 text-sm text-center font-medium">
                                        📧 Recibirás un email de confirmación en {formData.customer.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-8 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-sky-400/50 hover:scale-105 transition-all duration-300"
                            >
                                Agendar Otra Cita
                            </button>
                        </div>
                    </PageLayout>
                </div>
                <Footer showFooter={true} isStatic={true} />
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-white">
                <PageLayout>
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block mb-4">
                            <span className="px-6 py-2 bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-300 rounded-full text-sky-700 font-semibold text-sm tracking-wider uppercase">
                                Agenda Tu Cita
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                            Agendar <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">Servicio</span>
                        </h1>
                        <p className="text-xl text-slate-600">
                            Agenda tu cita en 3 simples pasos
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-center mb-12">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 ${step >= s
                                        ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-300/50'
                                        : 'bg-white border-2 border-slate-300 text-slate-400'
                                        }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-20 h-1 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-gradient-to-r from-sky-500 to-blue-600' : 'bg-slate-300'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Select Service */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center justify-center gap-3">
                                <Calendar className="text-sky-600" /> Selecciona el Servicio
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <button
                                        key={service.type}
                                        onClick={() => handleServiceSelect(service)}
                                        className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-200/40 transition-all duration-300 text-left group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                                {serviceLabels[service.type]}
                                            </h3>
                                            <div
                                                className="w-4 h-4 rounded-full shadow-lg"
                                                style={{ backgroundColor: service.color }}
                                            />
                                        </div>
                                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                            {serviceDescriptions[service.type]}
                                        </p>
                                        <div className="flex items-center text-sky-600 text-sm font-medium">
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
                                className="text-sky-600 hover:text-sky-700 font-medium mb-6 flex items-center gap-2"
                            >
                                ← Cambiar servicio
                            </button>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center justify-center gap-3">
                                <Clock className="text-sky-600" /> Selecciona Fecha y Hora
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Date Selection */}
                                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Fecha</h3>
                                    <input
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                        min={getMinDate()}
                                        className="w-full bg-white border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-900 transition-all"
                                    />
                                </div>

                                {/* Time Selection */}
                                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Horarios Disponibles</h3>
                                    {!formData.scheduledDate ? (
                                        <p className="text-slate-500 text-sm">Selecciona una fecha primero</p>
                                    ) : isLoading ? (
                                        <p className="text-slate-500 text-sm">Cargando horarios...</p>
                                    ) : availableSlots.length === 0 ? (
                                        <p className="text-slate-500 text-sm">No hay horarios disponibles para esta fecha</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                            {availableSlots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSlotSelect(slot)}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.startTime === slot.start
                                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
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
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => setStep(3)}
                                        className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-sky-400/50 hover:scale-105 transition-all duration-300"
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
                                className="text-sky-600 hover:text-sky-700 font-medium mb-6 flex items-center gap-2"
                            >
                                ← Cambiar fecha/hora
                            </button>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center justify-center gap-3">
                                <User className="text-sky-600" /> Tus Datos
                            </h2>

                            <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-xl">
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-slate-900 font-semibold mb-2">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            value={formData.customer.name}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                customer: { ...formData.customer, name: e.target.value }
                                            })}
                                            className="w-full bg-white border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-900 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-900 font-semibold mb-2">Teléfono *</label>
                                        <input
                                            type="tel"
                                            value={formData.customer.phone}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                customer: { ...formData.customer, phone: e.target.value }
                                            })}
                                            className="w-full bg-white border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-900 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-900 font-semibold mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.customer.email}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                customer: { ...formData.customer, email: e.target.value }
                                            })}
                                            className="w-full bg-white border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-900 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-slate-900 font-semibold mb-2">Dirección *</label>
                                        <input
                                            type="text"
                                            value={formData.customer.address}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                customer: { ...formData.customer, address: e.target.value }
                                            })}
                                            className="w-full bg-white border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-900 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-slate-900 font-semibold mb-2">
                                        Describe el problema o requerimiento (opcional)
                                    </label>
                                    <textarea
                                        value={formData.serviceDetails.issue}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            serviceDetails: { ...formData.serviceDetails, issue: e.target.value }
                                        })}
                                        className="w-full bg-white border-2 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 rounded-xl px-4 py-3 text-slate-900 transition-all"
                                        rows={4}
                                        placeholder="Ej: El aire acondicionado no enfría correctamente..."
                                    />
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                                    <p className="text-blue-700 text-sm font-medium">
                                        📍 Una vez confirmes tu cita, recibirás un email de confirmación y nuestro equipo se pondrá en contacto contigo.
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isLoading ? 'Agendando...' : 'Confirmar Cita'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </PageLayout>
            </div>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}

