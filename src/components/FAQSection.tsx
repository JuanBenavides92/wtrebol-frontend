'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Wrench, Shield, Calendar, DollarSign, Phone, ArrowRight, ExternalLink } from 'lucide-react';
import API_CONFIG from '@/lib/config';

// Mapeo de iconos
const iconMap: Record<string, any> = {
    Clock,
    Wrench,
    Shield,
    Calendar,
    DollarSign,
    Phone
};

interface RelatedLink {
    text: string;
    url: string;
}

interface BackContent {
    detailedAnswer?: string;
    tips?: string[];
    relatedLinks?: RelatedLink[];
}

interface FAQData {
    icon?: string;
    category?: string;
    color?: string;
    gradient?: string;
    backContent?: BackContent;
}

interface FAQ {
    _id: string;
    type: 'faq';
    title: string;
    description?: string;
    isActive: boolean;
    order?: number;
    data?: FAQData;
}

async function getFAQs(): Promise<FAQ[]> {
    try {
        const response = await fetch(API_CONFIG.url('/api/content/faq?active=true'), {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Error fetching FAQs:', response.statusText);
            return [];
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            return result.data.sort((a: FAQ, b: FAQ) => (a.order || 0) - (b.order || 0));
        }

        return [];
    } catch (error) {
        console.error('Error loading FAQs:', error);
        return [];
    }
}

function FlipCard({ faq, index }: { faq: FAQ; index: number }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const Icon = iconMap[faq.data?.icon || 'Phone'];
    const color = faq.data?.color || '#0EA5E9';
    const gradient = faq.data?.gradient || 'from-sky-400 to-blue-500';
    const backContent = faq.data?.backContent;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative h-[480px]"
            style={{ perspective: '1000px' }}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 cursor-pointer`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* FRENTE DE LA CARD */}
                <div
                    className="absolute w-full h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-200"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    {/* Icon */}
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: color }}
                    >
                        <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Category Badge */}
                    {faq.data?.category && (
                        <span className="inline-block mb-4 px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">
                            {faq.data.category}
                        </span>
                    )}

                    {/* Question */}
                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                        {faq.title}
                    </h3>

                    {/* Short Answer */}
                    <p className="text-slate-600 leading-relaxed mb-6">
                        {faq.description}
                    </p>

                    {/* Hint to flip */}
                    <div className="absolute bottom-6 left-8 right-8 flex items-center justify-center gap-2 text-sm text-slate-400 group-hover:text-slate-600 transition-colors">
                        <span>Haz clic para ver más detalles</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>

                    {/* Decorative line */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"
                        style={{ backgroundColor: color }}
                    />
                </div>

                {/* REVERSO DE LA CARD */}
                <div
                    className="absolute w-full h-full rounded-2xl p-8 shadow-lg"
                    style={{
                        backgroundColor: color,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div
                        className="h-full flex flex-col text-white overflow-y-auto pr-2 custom-scrollbar"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
                        }}
                    >
                        {/* Detailed Answer */}
                        {backContent?.detailedAnswer && (
                            <div className="mb-6">
                                <h4 className="text-lg font-bold mb-3">Respuesta Detallada</h4>
                                <p className="text-sm opacity-95 leading-relaxed">
                                    {backContent.detailedAnswer}
                                </p>
                            </div>
                        )}

                        {/* Tips */}
                        {backContent?.tips && backContent.tips.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-bold mb-3">💡 Tips Útiles</h4>
                                <div className="space-y-2">
                                    {backContent.tips.map((tip, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
                                            <span className="opacity-95">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Links */}
                        {backContent?.relatedLinks && backContent.relatedLinks.length > 0 && (
                            <div className="mt-auto">
                                <h4 className="text-lg font-bold mb-3">🔗 Enlaces Relacionados</h4>
                                <div className="space-y-2">
                                    {backContent.relatedLinks.map((link, idx) => (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span>{link.text}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hint to flip back */}
                        <div className="mt-4 text-center text-sm opacity-75">
                            Haz clic para volver
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function FAQSection() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFAQs().then(data => {
            setFaqs(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center text-slate-600">Cargando preguntas frecuentes...</div>
                </div>
            </section>
        );
    }

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

                {/* FAQ Cards Grid */}
                {faqs.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-slate-600 text-lg">No hay preguntas frecuentes disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {faqs.map((faq, index) => (
                            <FlipCard key={faq._id} faq={faq} index={index} />
                        ))}
                    </div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mt-16"
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

