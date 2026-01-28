'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle, DollarSign, Percent, Package } from 'lucide-react';
import API_CONFIG from '@/lib/config';

interface StoreSettings {
    shippingCost: number;
    shippingEnabled: boolean;
    taxVAT: number;
    taxVATEnabled: boolean;
    taxConsumption: number;
    taxConsumptionEnabled: boolean;
}

export default function StoreConfigPage() {
    const [settings, setSettings] = useState<StoreSettings>({
        shippingCost: 0,
        shippingEnabled: false,
        taxVAT: 19,
        taxVATEnabled: true,
        taxConsumption: 0,
        taxConsumptionEnabled: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(API_CONFIG.url('/api/admin/store-settings'), {
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSettings(result.settings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch(API_CONFIG.url('/api/admin/store-settings'), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(settings)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: result.message || 'Error al guardar' });
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Error al guardar la configuración' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Configuración de Tienda</h1>
                    <p className="text-gray-400">Configura los costos de envío e impuestos para tu tienda</p>
                </div>

                {/* Message Alert */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/50'
                            : 'bg-red-500/10 border border-red-500/50'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <p className={message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}>
                            {message.text}
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Shipping Configuration */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="h-6 w-6 text-sky-500" />
                            <h2 className="text-2xl font-bold text-white">Configuración de Envío</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Enable Shipping */}
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <label className="text-white font-medium">Cobrar envío</label>
                                    <p className="text-sm text-gray-400">Activar costo de envío en las órdenes</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.shippingEnabled}
                                        onChange={(e) => setSettings({ ...settings, shippingEnabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                                </label>
                            </div>

                            {/* Shipping Cost */}
                            {settings.shippingEnabled && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Costo de envío (COP)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings.shippingCost}
                                            onChange={(e) => setSettings({ ...settings, shippingCost: parseFloat(e.target.value) || 0 })}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Costo fijo de envío que se aplicará a todas las órdenes
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* IVA Configuration */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Percent className="h-6 w-6 text-emerald-500" />
                            <h2 className="text-2xl font-bold text-white">Configuración de IVA</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Enable IVA */}
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <label className="text-white font-medium">Aplicar IVA</label>
                                    <p className="text-sm text-gray-400">Mostrar y cobrar IVA en las órdenes</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.taxVATEnabled}
                                        onChange={(e) => setSettings({ ...settings, taxVATEnabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            {/* IVA Percentage */}
                            {settings.taxVATEnabled && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Porcentaje de IVA (%)
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={settings.taxVAT}
                                            onChange={(e) => setSettings({ ...settings, taxVAT: parseFloat(e.target.value) || 0 })}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                            placeholder="19"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Porcentaje de IVA que se aplicará al subtotal (Colombia: 19%)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Consumption Tax Configuration */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Percent className="h-6 w-6 text-purple-500" />
                            <h2 className="text-2xl font-bold text-white">Impuesto al Consumo</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Enable Consumption Tax */}
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <label className="text-white font-medium">Aplicar impuesto al consumo</label>
                                    <p className="text-sm text-gray-400">Mostrar y cobrar impuesto al consumo</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.taxConsumptionEnabled}
                                        onChange={(e) => setSettings({ ...settings, taxConsumptionEnabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                </label>
                            </div>

                            {/* Consumption Tax Percentage */}
                            {settings.taxConsumptionEnabled && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Porcentaje de impuesto al consumo (%)
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={settings.taxConsumption}
                                            onChange={(e) => setSettings({ ...settings, taxConsumption: parseFloat(e.target.value) || 0 })}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                            placeholder="8"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Porcentaje de impuesto al consumo (Colombia: 8% para ciertos productos)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Guardar Configuración
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
