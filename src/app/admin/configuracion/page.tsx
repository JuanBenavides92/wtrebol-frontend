'use client';

import { useState, useEffect } from 'react';
import API_CONFIG from '@/lib/config';

interface AppointmentSettings {
    businessHours: Record<string, { start: string; end: string; enabled: boolean }>;
    appointmentTypes: Record<string, { duration: number; enabled: boolean; color: string }>;
    slotInterval: number;
    bufferTime: number;
    maxAppointmentsPerDay: number;
    notifications: {
        emailEnabled: boolean;
        adminEmail: string;
        reminderHoursBefore: number;
    };
}

export default function ConfigurationPage() {
    const [settings, setSettings] = useState<AppointmentSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
    };

    const typeLabels: Record<string, string> = {
        maintenance: 'Mantenimiento',
        installation: 'Instalación',
        repair: 'Reparación',
        quotation: 'Cotización',
        emergency: 'Emergencia',
        deepClean: 'Limpieza Profunda',
        gasRefill: 'Recarga de Gas'
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENT_SETTINGS), {
                credentials: 'include'
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setSettings(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENT_SETTINGS), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setMessage('✅ Configuración guardada exitosamente');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('❌ Error al guardar la configuración');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !settings) {
        return (
            <div className="p-6 flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                    <p className="mt-4 text-gray-400">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Configuración del Sistema de Citas</h1>
                <p className="text-gray-400">Administra horarios, servicios y notificaciones</p>
            </div>

            {message && (
                <div className={`mb-6 px-4 py-3 rounded-lg ${message.includes('Error')
                        ? 'bg-red-500/10 border border-red-500/50 text-red-200'
                        : 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-200'
                    }`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {/* Horarios de Operación */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Horarios de Operación</h2>
                    <div className="space-y-4">
                        {days.map(day => (
                            <div key={day} className="grid grid-cols-4 gap-4 items-center">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={settings.businessHours[day].enabled}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            businessHours: {
                                                ...settings.businessHours,
                                                [day]: { ...settings.businessHours[day], enabled: e.target.checked }
                                            }
                                        })}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded mr-2"
                                    />
                                    <label className="text-sm font-medium text-gray-300">
                                        {dayLabels[day]}
                                    </label>
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        value={settings.businessHours[day].start}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            businessHours: {
                                                ...settings.businessHours,
                                                [day]: { ...settings.businessHours[day], start: e.target.value }
                                            }
                                        })}
                                        disabled={!settings.businessHours[day].enabled}
                                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white disabled:bg-slate-800 disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        value={settings.businessHours[day].end}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            businessHours: {
                                                ...settings.businessHours,
                                                [day]: { ...settings.businessHours[day], end: e.target.value }
                                            }
                                        })}
                                        disabled={!settings.businessHours[day].enabled}
                                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white disabled:bg-slate-800 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tipos de Servicios */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Tipos de Servicios</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(settings.appointmentTypes).map(([key, config]) => (
                            <div key={key} className="bg-slate-700/30 border border-white/10 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-white">{typeLabels[key]}</h3>
                                    <input
                                        type="checkbox"
                                        checked={config.enabled}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            appointmentTypes: {
                                                ...settings.appointmentTypes,
                                                [key]: { ...config, enabled: e.target.checked }
                                            }
                                        })}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Duración (minutos)</label>
                                        <input
                                            type="number"
                                            value={config.duration}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                appointmentTypes: {
                                                    ...settings.appointmentTypes,
                                                    [key]: { ...config, duration: parseInt(e.target.value) }
                                                }
                                            })}
                                            disabled={!config.enabled}
                                            className="w-full bg-slate-700 border border-white/10 rounded px-2 py-1 text-sm text-white disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Color</label>
                                        <input
                                            type="color"
                                            value={config.color}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                appointmentTypes: {
                                                    ...settings.appointmentTypes,
                                                    [key]: { ...config, color: e.target.value }
                                                }
                                            })}
                                            disabled={!config.enabled}
                                            className="w-full h-8 border border-white/10 rounded disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuración General */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Configuración General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Intervalo de Slots (minutos)
                            </label>
                            <select
                                value={settings.slotInterval}
                                onChange={(e) => setSettings({ ...settings, slotInterval: parseInt(e.target.value) })}
                                className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                            >
                                <option value={15}>15 minutos</option>
                                <option value={30}>30 minutos</option>
                                <option value={60}>60 minutos</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tiempo de Buffer (minutos)
                            </label>
                            <input
                                type="number"
                                value={settings.bufferTime}
                                onChange={(e) => setSettings({ ...settings, bufferTime: parseInt(e.target.value) })}
                                className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Máximo Citas por Día
                            </label>
                            <input
                                type="number"
                                value={settings.maxAppointmentsPerDay}
                                onChange={(e) => setSettings({ ...settings, maxAppointmentsPerDay: parseInt(e.target.value) })}
                                className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Notificaciones */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Notificaciones por Email</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.notifications.emailEnabled}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, emailEnabled: e.target.checked }
                                })}
                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded mr-2"
                            />
                            <label className="text-sm font-medium text-gray-300">
                                Habilitar notificaciones por email
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email del Administrador (donde recibirás las notificaciones)
                            </label>
                            <input
                                type="email"
                                value={settings.notifications.adminEmail}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, adminEmail: e.target.value }
                                })}
                                className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                                placeholder="admin@wtrebol.com"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                💡 Cambia este email para pruebas. Todas las notificaciones irán a este correo.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recordatorio (horas antes)
                            </label>
                            <input
                                type="number"
                                value={settings.notifications.reminderHoursBefore}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, reminderHoursBefore: parseInt(e.target.value) }
                                })}
                                className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Botón Guardar */}
                <div className="flex justify-end pt-6 border-t border-white/10">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </div>
        </div>
    );
}

