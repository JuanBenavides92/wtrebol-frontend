'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Lock, Shield, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import API_CONFIG from '@/lib/config';

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const ROLE_OPTIONS = [
    { value: 'admin', label: 'Administrador', description: 'Acceso completo al sistema' },
    { value: 'manager', label: 'Gerente', description: 'Gestión de pedidos y clientes' },
    { value: 'editor', label: 'Editor', description: 'Edición de contenido y productos' },
    { value: 'viewer', label: 'Visualizador', description: 'Solo lectura' }
];

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id as string;

    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'editor',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const fetchUser = async () => {
        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/${userId}`),
                { credentials: 'include' }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                    setFormData({
                        name: data.user.name,
                        email: data.user.email,
                        role: data.user.role,
                        newPassword: '',
                        confirmPassword: ''
                    });
                }
            } else {
                router.push('/admin/usuarios');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            router.push('/admin/usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validaciones
        if (!formData.name || !formData.email) {
            setError('Nombre y email son requeridos');
            return;
        }

        // Si cambia contraseña
        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Las contraseñas no coinciden');
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const updateData: any = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ADMIN_USERS}/${userId}`),
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(updateData)
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMessage('Usuario actualizado exitosamente');
                setFormData(prev => ({
                    ...prev,
                    newPassword: '',
                    confirmPassword: ''
                }));
                // Refresh user data
                await fetchUser();
            } else {
                setError(data.message || 'Error al actualizar usuario');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8">
                <div className="text-center py-20">
                    <User className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Usuario no encontrado</h2>
                    <Link
                        href="/admin/usuarios"
                        className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a usuarios
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/usuarios"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a usuarios
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Editar Usuario</h1>
                    <p className="text-gray-400">
                        Usuario desde {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {successMessage && (
                            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2">
                                <Check className="h-5 w-5" />
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Información Personal */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4">Información Personal</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nombre Completo *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cambiar Contraseña */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4">Cambiar Contraseña (Opcional)</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Mínimo 6 caracteres. Dejar vacío para no cambiar.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rol */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4">Permisos y Rol</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rol del Usuario *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Shield className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500/50 appearance-none"
                                    >
                                        {ROLE_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    {ROLE_OPTIONS.find(r => r.value === formData.role)?.description}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                            <Link
                                href="/admin/usuarios"
                                className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 text-gray-300 hover:text-white font-semibold rounded-lg transition-all text-center flex items-center justify-center"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
