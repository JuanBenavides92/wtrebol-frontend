'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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
        { value: 'maintenance', label: 'Mantenimiento' },
        { value: 'installation', label: 'Instalación' },
        { value: 'repair', label: 'Reparación' },
        { value: 'quotation', label: 'Cotización' },
        { value: 'emergency', label: 'Emergencia' },
        { value: 'deep-clean', label: 'Limpieza Profunda' },
        { value: 'gas-refill', label: 'Recarga de Gas' }
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                <p className="mt-4">Cargando técnico...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => router.push('/admin/tecnicos')}
                    className="text-sky-500 hover:text-sky-600 mb-4"
                >
                    ← Volver a técnicos
                </button>
                <h1 className="text-3xl font-bold">
                    {isEditing ? 'Editar Técnico' : 'Nuevo Técnico'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especialidades *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {availableSpecialties.map((spec) => (
                            <button
                                key={spec.value}
                                type="button"
                                onClick={() => toggleSpecialty(spec.value)}
                                className={`px-4 py-2 rounded-lg border transition-colors ${formData.specialties.includes(spec.value)
                                        ? 'bg-sky-500 text-white border-sky-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-sky-500'
                                    }`}
                            >
                                {spec.label}
                            </button>
                        ))}
                    </div>
                    {formData.specialties.length === 0 && (
                        <p className="text-sm text-red-600 mt-2">Selecciona al menos una especialidad</p>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Técnico activo
                    </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/tecnicos')}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || formData.specialties.length === 0}
                        className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Técnico' : 'Crear Técnico'}
                    </button>
                </div>
            </form>
        </div>
    );
}
