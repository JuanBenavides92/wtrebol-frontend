'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import API_CONFIG from '@/lib/config';

interface Service {
    id: number;
    title: string;
    description: string;
    features: string[];
    benefits: string[];
    icon: string;
    color: string;
    gradient: string;
    buttonText?: string;
    buttonLink?: string;
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    // Transform values for 3D effect
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
    const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [15, 0, 0, -5]);

    // Alternate layout: odd = image left, even = image right
    const isImageLeft = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            style={{
                scale,
                opacity,
                y,
                rotateX,
            }}
            className="min-h-screen flex items-center justify-center px-6 py-20"
        >
            <div className={`container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center ${!isImageLeft ? 'lg:grid-flow-dense' : ''}`}>
                {/* Image Card */}
                <motion.div
                    className={`relative ${!isImageLeft ? 'lg:col-start-2' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div
                        className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                        style={{
                            background: service.gradient,
                        }}
                    >
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

                        {/* Icon/Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-9xl opacity-20">{service.icon}</div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
                    </div>
                </motion.div>

                {/* Content Card */}
                <div className={`space-y-6 ${!isImageLeft ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                            style={{ background: service.gradient }}
                        >
                            {service.icon}
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900">
                            {service.title}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-slate-900">¿Qué incluye?</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-slate-600">
                                    <span className="text-lg mt-0.5" style={{ color: service.color }}>✓</span>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-slate-900">Beneficios</h4>
                        <ul className="space-y-2">
                            {service.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-slate-600">
                                    <span className="text-lg" style={{ color: service.color }}>★</span>
                                    <span className="text-sm">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA Button */}
                    <motion.a
                        href={service.buttonLink || '/contacto'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-2xl transition-all duration-300"
                        style={{ background: service.gradient }}
                    >
                        {service.buttonText || 'Solicitar Servicio'}
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
}

export default function ServiciosSection3D() {
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
            const response = await fetch(API_CONFIG.url('/api/content/service'));

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    // Mapear datos del backend al formato esperado
                    const mappedServices = result.data
                        .filter((s: any) => s.isActive)
                        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                        .map((s: any, index: number) => ({
                            id: index + 1,
                            title: s.title,
                            description: s.description || '',
                            features: s.data?.features || [],
                            benefits: s.data?.benefits || [],
                            icon: s.data?.icon || '🔧',
                            color: s.data?.color || '#0EA5E9',
                            gradient: s.data?.gradient || 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                            buttonText: s.data?.buttonText || 'Solicitar Servicio',
                            buttonLink: s.data?.buttonLink || '/contacto',
                        }));
                    setServices(mappedServices);
                } else {
                    setError('No se pudieron cargar los servicios');
                }
            } else {
                setError('Error al conectar con el servidor');
            }
        } catch (error) {
            console.error('Error loading services:', error);
            setError('Error al cargar servicios');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <section className="relative bg-white py-20">
                <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600">Cargando servicios...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative bg-white py-20">
                <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={loadServices}
                            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (services.length === 0) {
        return (
            <section className="relative bg-white py-20">
                <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-slate-600">No hay servicios disponibles en este momento.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative bg-white overflow-hidden">
            {/* Header */}
            <div className="container mx-auto px-6 pt-20 pb-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                >
                    Nuestros Servicios
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-slate-600 max-w-3xl mx-auto"
                >
                    Soluciones profesionales de aire acondicionado para tu hogar o negocio
                </motion.p>
            </div>

            {/* Services with 3D Scroll Effect */}
            <div className="relative">
                {services.map((service, index) => (
                    <ServiceCard key={service.id} service={service} index={index} />
                ))}
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />
            </div>
        </section>
    );
}

