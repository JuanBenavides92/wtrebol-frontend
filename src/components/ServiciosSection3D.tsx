'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Service {
    id: number;
    title: string;
    description: string;
    features: string[];
    benefits: string[];
    icon: string;
    color: string;
    gradient: string;
}

const services: Service[] = [
    {
        id: 1,
        title: 'Mantenimiento Preventivo HVAC',
        description: 'Nuestro servicio de mantenimiento preventivo es la clave para garantizar el rendimiento óptimo y prolongar la vida útil de tu sistema de climatización. Similar a un chequeo médico para tu equipo, nuestros técnicos certificados realizan inspecciones exhaustivas y ajustes precisos que previenen averías costosas antes de que ocurran.',
        features: [
            'Limpieza profunda de filtros y serpentines',
            'Verificación del sistema de refrigerante',
            'Inspección eléctrica completa',
            'Optimización del flujo de aire',
            'Calibración de termostato',
            'Sistema de drenaje'
        ],
        benefits: [
            'Reduce facturas de electricidad hasta un 30%',
            'Previene averías inesperadas',
            'Extiende la vida útil del equipo',
            'Mejora la calidad del aire interior'
        ],
        icon: '🔧',
        color: '#0EA5E9',
        gradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)'
    },
    {
        id: 2,
        title: 'Instalación Profesional de Sistemas HVAC',
        description: 'La instalación correcta de tu sistema de climatización es fundamental para garantizar eficiencia energética, rendimiento óptimo y durabilidad a largo plazo. Nuestro equipo de expertos certificados maneja cada proyecto con precisión técnica y cumplimiento estricto de normativas de seguridad.',
        features: [
            'Evaluación técnica inicial',
            'Selección del sistema ideal',
            'Preparación del área',
            'Instalación de unidades certificada',
            'Conexiones profesionales',
            'Pruebas y verificación completa'
        ],
        benefits: [
            'Instalación certificada por técnicos licenciados',
            'Cumplimiento de normativas locales',
            'Garantía del fabricante y de instalación',
            'Eficiencia energética optimizada'
        ],
        icon: '⚙️',
        color: '#8B5CF6',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
    },
    {
        id: 3,
        title: 'Reparación Especializada y Diagnóstico Avanzado',
        description: 'Cuando tu sistema de climatización presenta fallas, nuestro equipo de técnicos certificados utiliza tecnología de diagnóstico avanzada para identificar la raíz del problema y ofrecer soluciones duraderas, no solo parches temporales.',
        features: [
            'Diagnóstico preciso con tecnología avanzada',
            'Reparación de fallas eléctricas',
            'Solución de fugas de refrigerante',
            'Reparación de ruidos anormales',
            'Corrección de problemas de enfriamiento',
            'Servicio de emergencia 24/7'
        ],
        benefits: [
            'Respuesta rápida ante emergencias',
            'Técnicos certificados con experiencia',
            'Repuestos originales de calidad',
            'Garantía en todas las reparaciones'
        ],
        icon: '🛠️',
        color: '#F59E0B',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
    }
];

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
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-2xl transition-all duration-300"
                        style={{ background: service.gradient }}
                    >
                        Solicitar Servicio
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

export default function ServiciosSection3D() {
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
