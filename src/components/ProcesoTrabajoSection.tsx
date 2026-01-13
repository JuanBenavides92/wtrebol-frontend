'use client';

import { motion } from 'framer-motion';
import { Phone, ClipboardCheck, FileText, Wrench, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: Phone,
        title: 'Contacto Inicial',
        description: 'Llámanos o agenda online. Te atendemos de inmediato',
        color: '#0EA5E9'
    },
    {
        icon: ClipboardCheck,
        title: 'Evaluación Gratuita',
        description: 'Visitamos tu ubicación sin costo para diagnóstico',
        color: '#8B5CF6'
    },
    {
        icon: FileText,
        title: 'Propuesta Personalizada',
        description: 'Cotización detallada y transparente adaptada a tus necesidades',
        color: '#F59E0B'
    },
    {
        icon: Wrench,
        title: 'Ejecución Profesional',
        description: 'Nuestro equipo certificado realiza el trabajo con excelencia',
        color: '#10B981'
    },
    {
        icon: CheckCircle,
        title: 'Verificación de Calidad',
        description: 'Pruebas finales y garantía de satisfacción total',
        color: '#EC4899'
    }
];

export default function ProcesoTrabajoSection() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #0EA5E9 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
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
                        Nuestro Proceso de Trabajo
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Un proceso simple y transparente de principio a fin
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-6xl mx-auto">
                    {/* Desktop Timeline (Horizontal) */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-sky-200 via-purple-200 to-pink-200" />

                            <div className="grid grid-cols-5 gap-4">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.15 }}
                                            className="relative"
                                        >
                                            {/* Step Number and Icon */}
                                            <div className="flex flex-col items-center mb-6">
                                                <div
                                                    className="w-32 h-32 rounded-full flex items-center justify-center mb-4 relative z-10 shadow-xl"
                                                    style={{ backgroundColor: step.color }}
                                                >
                                                    <Icon className="w-12 h-12 text-white" />
                                                </div>
                                                <div
                                                    className="absolute top-14 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-slate-800 z-20 border-4 border-white"
                                                >
                                                    {index + 1}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="text-center">
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Timeline (Vertical) */}
                    <div className="lg:hidden space-y-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-6"
                                >
                                    {/* Icon and Line */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative"
                                            style={{ backgroundColor: step.color }}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold border-2 border-white">
                                                {index + 1}
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="w-1 h-full bg-gradient-to-b from-slate-300 to-transparent mt-2" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-8">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
