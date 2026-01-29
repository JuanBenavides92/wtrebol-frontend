'use client';

import { useState, useEffect } from 'react';
import API_CONFIG from '@/lib/config';

interface Service {
    _id: string;
    type: 'service';
    title: string;
    description?: string;
    imageUrl: string;
    isActive: boolean;
}

export default function ServiciosSection() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.SERVICES}?active=true`));

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setServices(result.data);
                } else {
                    console.warn('Backend response format unexpected:', result);
                    setServices([]);
                }
            } else {
                setError('Error al cargar servicios');
            }
        } catch (err) {
            console.error('Error loading services:', err);
            setError('Error al cargar servicios');
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render section if no services
    if (!isLoading && services.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
                    Nuestros Servicios
                </h2>
                <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                    Soluciones profesionales de aire acondicionado para tu hogar o negocio
                </p>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">
                        {error}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="p-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl hover:shadow-xl transition-all duration-300"
                            >
                                {service.imageUrl && (
                                    <div className="w-20 h-20 mb-4 rounded-xl overflow-hidden bg-white shadow-md">
                                        <img
                                            src={service.imageUrl}
                                            alt={service.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2 text-slate-900">{service.title}</h3>
                                <p className="text-slate-600">
                                    {service.description || `Servicio profesional de ${service.title.toLowerCase()}`}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

