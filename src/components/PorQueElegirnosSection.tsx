'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Award, Wrench, DollarSign, Smartphone } from 'lucide-react';

const features = [
    {
        icon: Award,
        title: 'Certificaciones Profesionales',
        description: 'Técnicos certificados y licenciados con años de experiencia en sistemas HVAC',
        color: '#0EA5E9',
        gradient: 'from-sky-400 to-blue-500'
    },
    {
        icon: Zap,
        title: 'Respuesta Rápida',
        description: 'Atención inmediata a tus solicitudes con tiempos de respuesta optimizados',
        color: '#F59E0B',
        gradient: 'from-amber-400 to-orange-500'
    },
    {
        icon: Shield,
        title: 'Garantía Total',
        description: 'Todos nuestros servicios incluyen garantía completa en mano de obra y repuestos',
        color: '#10B981',
        gradient: 'from-emerald-400 to-green-500'
    },
    {
        icon: Wrench,
        title: 'Tecnología de Punta',
        description: 'Equipos y herramientas de última generación para diagnósticos precisos',
        color: '#8B5CF6',
        gradient: 'from-purple-400 to-violet-500'
    },
    {
        icon: DollarSign,
        title: 'Precios Transparentes',
        description: 'Cotizaciones claras sin costos ocultos. Sabes exactamente qué pagas',
        color: '#EC4899',
        gradient: 'from-pink-400 to-rose-500'
    },
    {
        icon: Smartphone,
        title: 'Seguimiento Digital',
        description: 'Plataforma online para agendar, dar seguimiento y gestionar tus servicios',
        color: '#06B6D4',
        gradient: 'from-cyan-400 to-teal-500'
    }
];

export default function PorQueElegirnosSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        ¿Por Qué Elegirnos?
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Somos tu mejor opción en servicios de climatización profesional
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Decorative gradient line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
