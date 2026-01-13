'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Wrench, Save, X, Loader2 } from 'lucide-react';

export default function TechnicianFormPage() {
    const router = useRouter();
    const params = useParams();
    const technicianId = params?.id as string;
    const isEditing = technicianId && technicianId !== 'nuevo';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialties: [] as string[],
        isActive: true
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const availableSpecialties = [
        { value: 'maintenance', label: 'Mantenimiento', icon: '🔧' },
        { value: 'installation', label: 'Instalación', icon: '🏗️' },
        { value: 'repair', label: 'Reparación', icon: '🛠️' },
        { value: 'quotation', label: 'Cotización', icon: '📋' },
        { value: 'emergency', label: 'Emergencia', icon: '🚨' },
        { value: 'deep-clean', label: 'Limpieza Profunda', icon: '✨' },
        { value: 'gas-refill', label: 'Recarga de Gas', icon: '⚡' }
    ];

    useEffect(() => {
        if (isEditing) {
            loadTechnician();
        }
    }, []);

    const loadTechnician = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/technicians/${technicianId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setFormData(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading technician:', error);
            setError('Error al cargar el técnico');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const url = isEditing
                ? `http://localhost:5000/api/technicians/${technicianId}`
                : 'http://localhost:5000/api/technicians';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                router.push('/admin/tecnicos');
            } else {
                setError(result.message || 'Error al guardar el técnico');
            }
        } catch (error) {
            console.error('Error saving technician:', error);
            setError('Error al guardar el técnico');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSpecialty = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    if (isLoading && isEditing) {
        return (
            <div className="p-6 text-center">
                <Loader2 className="inline-block h-12 w-12 text-sky-500 animate-spin" />
                <p className="mt-4 text-white">Cargando técnico...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <button
                    onClick={() => router.push('/admin/tecnicos')}
                    className="flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a técnicos
                </button>
                <h1 className="text-4xl font-bold text-white">
                    {isEditing ? 'Editar Técnico' : 'Nuevo Técnico'}
                </h1>
            </motion.div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6"
                >
                    {error}
                </motion.div>
            )}

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6"
            >
                {/* Nombre */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <User className="w-4 h-4 text-sky-400" />
                        Nombre <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="Nombre completo del técnico"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="correo@ejemplo.com"
                        required
                    />
                </div>

                {/* Teléfono */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                        <Phone className="w-4 h-4 text-purple-400" />
                        Teléfono <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        placeholder="+57 300 123 4567"
                        required
                    />
                </div>

                {/* Especialidades */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                        <Wrench className="w-4 h-4 text-amber-400" />
                        Especialidades <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {availableSpecialties.map((spec) => (
                            <motion.button
                                key={spec.value}
                                type="button"
                                onClick={() => toggleSpecialty(spec.value)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                    px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm
                                    ${formData.specialties.includes(spec.value)
                                        ? 'bg-sky-500/20 text-white border-sky-500'
                                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                                    }
                                `}
                            >
                                <span className="mr-2">{spec.icon}</span>
                                {spec.label}
                            </motion.button>
                        ))}
                    </div>
                    {formData.specialties.length === 0 && (
                        <p className="text-sm text-red-400 mt-2">Selecciona al menos una especialidad</p>
                    )}
                </div>

                {/* Técnico Activo */}
                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-white/20 rounded bg-white/5"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-white cursor-pointer">
                        Técnico activo
                    </label>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/tecnicos')}
                        className="px-6 py-3 border border-white/10 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-medium flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || formData.specialties.length === 0}
                        className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {isEditing ? 'Actualizar Técnico' : 'Crear Técnico'}
                            </>
                        )}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
