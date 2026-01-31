'use client';

import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ServiceData {
    features?: string[];
    benefits?: string[];
    icon?: string;
    color?: string;
    gradient?: string;
}

interface Service {
    _id: string;
    type: 'service';
    title: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    order?: number;
    data?: ServiceData;
    createdAt: string;
    updatedAt: string;
}

export default function ServiciosPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL!;
            const response = await fetch(`${API_URL}/api/content/service?active=true`);

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setServices(result.data.sort((a: Service, b: Service) => (a.order || 0) - (b.order || 0)));
                }
            }
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white">
                <PageLayout>
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-block mb-4"
                        >
                            <span className="px-6 py-2 bg-gradient-to-r from-sky-100 to-blue-100 border border-sky-300 rounded-full text-sky-700 font-semibold text-sm tracking-wider uppercase">
                                Lo Que Hacemos
                            </span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                            Nuestros <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">Servicios</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Soluciones integrales diseñadas para tus necesidades de climatización y refrigeración
                        </p>
                    </motion.div>

                    {/* Services Grid */}
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-600 mt-4">Cargando servicios...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-12 bg-white border-2 border-slate-200 rounded-2xl shadow-lg">
                            <p className="text-slate-600 text-lg">No hay servicios disponibles en este momento.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => {
                                const features = service.data?.features || [];
                                const benefits = service.data?.benefits || [];
                                const icon = service.data?.icon || '🔧';
                                const color = service.data?.color || '#0EA5E9';

                                return (
                                    <motion.div
                                        key={service._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-500 relative overflow-hidden"
                                    >
                                        {/* Top Gradient Bar */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: `linear-gradient(90deg, ${color}, ${color}dd)`
                                            }}
                                        />

                                        {/* Icon & Title */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-500"
                                                style={{
                                                    background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                                                    border: `2px solid ${color}30`
                                                }}
                                            >
                                                {icon}
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                                {service.title}
                                            </h3>
                                        </div>

                                        {/* Description */}
                                        {service.description && (
                                            <p className="text-slate-600 mb-6 leading-relaxed">
                                                {service.description}
                                            </p>
                                        )}

                                        {/* Features */}
                                        {features.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-bold text-sky-700 mb-3 uppercase tracking-wide">
                                                    Características:
                                                </h4>
                                                <div className="space-y-2">
                                                    {features.map((feature, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                            <span className="text-slate-700 text-sm">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Benefits */}
                                        {benefits.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-blue-700 mb-3 uppercase tracking-wide">
                                                    Beneficios:
                                                </h4>
                                                <div className="space-y-2">
                                                    {benefits.map((benefit, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                            <span className="text-slate-700 text-sm">{benefit}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hover Glow Effect */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                                            style={{
                                                background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)`
                                            }}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-block bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-sky-200 rounded-2xl p-10 shadow-lg shadow-sky-100/50">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                ¿Necesitas un servicio personalizado?
                            </h3>
                            <p className="text-slate-600 mb-6 max-w-2xl">
                                Contáctanos para una consulta gratuita y descubre cómo nuestros expertos pueden ayudarte
                            </p>
                            <a
                                href="/contacto"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-sky-400/50 hover:scale-105 transition-all duration-300"
                            >
                                Solicitar Consulta
                            </a>
                        </div>
                    </motion.div>
                </PageLayout>
            </div>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}
