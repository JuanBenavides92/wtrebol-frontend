'use client';

import { useState, useEffect } from 'react';
import { Upload, Save, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import API_CONFIG from '@/lib/config';

interface SiteConfig {
    _id?: string;
    logoUrl?: string;
    logoText: string;
    logoSubtext?: string;
    logoHeight?: number;
    faviconUrl?: string;
    contactPhone?: string;
    contactEmail?: string;
}

export default function SiteConfigPage() {
    const [config, setConfig] = useState<SiteConfig>({
        logoText: 'WTREBOL',
        logoSubtext: 'INNOVACIÓN',
        logoHeight: 40,
        contactPhone: '+573028194432',
        contactEmail: 'Wtrebol2020@hotmail.com'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cargar configuración actual
    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_CONFIG.url('/api/config/site'), {
                cache: 'no-store'
            });
            const result = await response.json();

            if (result.success && result.data) {
                setConfig(result.data);
                setLogoPreview(result.data.logoUrl || null);
                setFaviconPreview(result.data.faviconUrl || null);
            }
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            setMessage({ type: 'error', text: 'Error al cargar configuración' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tamaño (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'El archivo debe ser menor a 2MB' });
                return;
            }

            // Validar tipo
            if (!['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(file.type)) {
                setMessage({ type: 'error', text: 'Solo se permiten archivos PNG, JPG o SVG' });
                return;
            }

            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setMessage(null);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage(null);

            const formData = new FormData();

            if (logoFile) {
                formData.append('logo', logoFile);
            }

            if (faviconFile) {
                formData.append('favicon', faviconFile);
            }

            formData.append('logoText', config.logoText);
            formData.append('logoSubtext', config.logoSubtext || '');
            formData.append('logoHeight', String(config.logoHeight || 40));
            formData.append('contactPhone', config.contactPhone || '');
            formData.append('contactEmail', config.contactEmail || '');

            const response = await fetch(API_CONFIG.url('/api/config/site'), {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ type: 'success', text: '✅ Configuración guardada exitosamente' });
                setConfig(result.data);
                setLogoFile(null);
                setFaviconFile(null);

                // Recargar la página después de 1 segundo para ver los cambios en el header
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error(result.message || 'Error al guardar');
            }
        } catch (error: any) {
            console.error('Error al guardar:', error);
            setMessage({ type: 'error', text: `❌ ${error.message || 'Error al guardar configuración'}` });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Configuración del Sitio</h1>
                <p className="text-gray-400">Personaliza el logo y la identidad visual de tu sitio web</p>
            </div>

            {/* Mensaje de éxito/error */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/50 text-green-200'
                    : 'bg-red-500/10 border border-red-500/50 text-red-200'
                    }`}>
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            {/* Logo Section */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl p-8 mb-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-sky-500" />
                    Logo del Sitio
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Vista Previa
                        </label>
                        <div className="p-6 bg-slate-900 rounded-xl flex items-center justify-center h-40 border-2 border-slate-700">
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    style={{ height: `${config.logoHeight || 40}px` }}
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-white text-2xl">
                                    {config.logoText?.[0] || 'W'}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Así se verá en el header de tu sitio
                        </p>
                    </div>

                    {/* Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Subir Logo
                        </label>
                        <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 hover:border-sky-400 transition-colors">
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                onChange={handleLogoChange}
                                className="hidden"
                                id="logo-upload"
                            />
                            <label
                                htmlFor="logo-upload"
                                className="cursor-pointer flex flex-col items-center gap-3"
                            >
                                <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-sky-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-300">
                                        Haz clic para subir
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, SVG (máx. 2MB)
                                    </p>
                                </div>
                            </label>
                        </div>
                        {logoFile && (
                            <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                                ✓ {logoFile.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Texto del Logo */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Texto Principal
                        </label>
                        <input
                            type="text"
                            value={config.logoText}
                            onChange={(e) => setConfig({ ...config, logoText: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                            placeholder="WTREBOL"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Subtexto
                        </label>
                        <input
                            type="text"
                            value={config.logoSubtext || ''}
                            onChange={(e) => setConfig({ ...config, logoSubtext: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                            placeholder="INNOVACIÓN"
                        />
                    </div>
                </div>

                {/* Tamaño del Logo */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Tamaño del Logo: {config.logoHeight || 40}px
                    </label>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">Pequeño</span>
                        <input
                            type="range"
                            min="20"
                            max="80"
                            step="5"
                            value={config.logoHeight || 40}
                            onChange={(e) => setConfig({ ...config, logoHeight: parseInt(e.target.value) })}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-xs text-gray-400">Grande</span>
                        <span className="text-sm font-medium text-sky-400 min-w-[60px] text-right">
                            {config.logoHeight || 40}px
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Ajusta la altura del logo como aparecerá en el header
                    </p>
                </div>
            </div>

            {/* Favicon Section */}
            <div className="bg-slate-800/30 border border-white/10 rounded-xl p-8 mb-6">
                <h2 className="text-xl font-semibold text-white mb-6">Favicon del Sitio</h2>
                <p className="text-sm text-gray-400 mb-6">El favicon es el pequeño icono que aparece en la pestaña del navegador</p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Vista Previa
                        </label>
                        <div className="p-6 bg-slate-900 rounded-xl flex items-center justify-center h-32 border-2 border-slate-700">
                            {faviconPreview ? (
                                <img
                                    src={faviconPreview}
                                    alt="Favicon Preview"
                                    className="h-16 w-16 object-contain"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">
                                    {config.logoText?.[0] || 'W'}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Tamaño recomendado: 32x32px o 64x64px
                        </p>
                    </div>

                    {/* Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Subir Favicon
                        </label>
                        <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 hover:border-sky-400 transition-colors">
                            <input
                                type="file"
                                accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 1024 * 1024) {
                                            setMessage({ type: 'error', text: 'El favicon debe ser menor a 1MB' });
                                            return;
                                        }
                                        setFaviconFile(file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFaviconPreview(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                        setMessage(null);
                                    }
                                }}
                                className="hidden"
                                id="favicon-upload"
                            />
                            <label
                                htmlFor="favicon-upload"
                                className="cursor-pointer flex flex-col items-center gap-3"
                            >
                                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-purple-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-300">
                                        Haz clic para subir
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, ICO (máx. 1MB)
                                    </p>
                                </div>
                            </label>
                        </div>
                        {faviconFile && (
                            <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                                ✓ {faviconFile.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Guardar Cambios
                        </>
                    )}
                </button>

                <button
                    onClick={fetchConfig}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                    <RefreshCw className="w-5 h-5" />
                    Recargar
                </button>
            </div>

            {/* Nota informativa */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <p className="text-sm text-blue-200">
                    <strong>💡 Nota:</strong> Los cambios se verán reflejados inmediatamente en el header después de guardar.
                    La página se recargará automáticamente para mostrar los cambios.
                </p>
            </div>
        </div>
    );
}
