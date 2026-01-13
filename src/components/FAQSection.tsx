'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, DollarSign, Wrench, Calendar, Phone, Shield } from 'lucide-react';

const faqs = [
    {
        icon: Clock,
        question: '¿Cada cuánto debo hacer mantenimiento a mi aire acondicionado?',
        answer: 'Recomendamos realizar mantenimiento preventivo cada 6 meses para uso residencial y cada 3-4 meses para uso comercial. Esto garantiza eficiencia óptima y previene averías costosas.',
        category: 'Mantenimiento'
    },
    {
        icon: Wrench,
        question: '¿Cuánto tiempo tarda una instalación de aire acondicionado?',
        answer: 'Una instalación residencial típica toma entre 4-8 horas. Para sistemas comerciales o más complejos, puede tomar 1-3 días. Te proporcionamos un cronograma detallado en la cotización.',
        category: 'Instalación'
    },
    {
        icon: Shield,
        question: '¿Qué garantía ofrecen en sus servicios?',
        answer: 'Ofrecemos garantía de 1 año en mano de obra y respetamos la garantía del fabricante en equipos y repuestos. Todos nuestros servicios están respaldados por técnicos certificados.',
        category: 'Garantía'
    },
    {
        icon: Calendar,
        question: '¿Trabajan fines de semana y días festivos?',
        answer: 'Sí, trabajamos 7 días a la semana. Para emergencias, ofrecemos servicio 24/7 los 365 días del año. Los horarios regulares son de 8 AM a 8 PM.',
        category: 'Horarios'
    },
    {
        icon: DollarSign,
        question: '¿Qué formas de pago aceptan?',
        answer: 'Aceptamos efectivo, transferencias bancarias, tarjetas de crédito/débito y pagos digitales. También ofrecemos planes de financiamiento para proyectos grandes.',
        category: 'Pagos'
    },
    {
        icon: Phone,
        question: '¿Cómo puedo agendar un servicio?',
        answer: 'Puedes agendar llamándonos, por WhatsApp, o a través de nuestro sistema de citas online. Te confirmamos la cita en menos de 2 horas.',
        category: 'Agendamiento'
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(to right, #0EA5E9 1px, transparent 1px), linear-gradient(to bottom, #0EA5E9 1px, transparent 1px)',
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
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Resolvemos tus dudas más comunes sobre nuestros servicios
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq, index) => {
                        const Icon = faq.icon;
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full text-left bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-sky-400 transition-all duration-300 group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Question */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                                    {faq.question}
                                                </h3>
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex-shrink-0"
                                                >
                                                    <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-sky-600" />
                                                </motion.div>
                                            </div>

                                            {/* Category Badge */}
                                            <span className="inline-block mt-2 px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">
                                                {faq.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Answer */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="mt-4 pl-16 text-slate-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-600 mb-4">
                        ¿No encuentras la respuesta que buscas?
                    </p>
                    <a
                        href="/contacto"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        Contáctanos Directamente
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
