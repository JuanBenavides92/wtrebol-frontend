'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Award, Wrench, DollarSign, Smartphone, ArrowRight } from 'lucide-react';
import API_CONFIG from '@/lib/config';

// Mapeo de iconos
const iconMap: Record<string, any> = {
    Award,
    Zap,
    Shield,
    Wrench,
    DollarSign,
    Smartphone
};

interface BackContent {
    statistics?: Array<{ label: string; value: string }>;
    details?: string[];
    cta?: string;
}

interface AdvantageData {
    icon?: string;
    color?: string;
    gradient?: string;
    showButton?: boolean;
    backContent?: BackContent;
}

interface Advantage {
    _id: string;
    type: 'advantage';
    title: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
    isActive: boolean;
    order?: number;
    data?: AdvantageData;
}

async function getAdvantages(): Promise<Advantage[]> {
    try {
        const response = await fetch(API_CONFIG.url('/api/content/advantage?active=true'), {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Error fetching advantages:', response.statusText);
            return [];
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            return result.data.sort((a: Advantage, b: Advantage) => (a.order || 0) - (b.order || 0));
        }

        return [];
    } catch (error) {
        console.error('Error loading advantages:', error);
        return [];
    }
}

function FlipCard({ advantage, index }: { advantage: Advantage; index: number }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const Icon = iconMap[advantage.data?.icon || 'Award'];
    const color = advantage.data?.color || '#0EA5E9';
    const gradient = advantage.data?.gradient || 'from-sky-400 to-blue-500';
    const backContent = advantage.data?.backContent;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative h-[420px]"
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
                    className="absolute w-full h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
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

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {advantage.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        {advantage.description}
                    </p>

                    {/* Hint to flip */}
                    <div className="absolute bottom-6 left-8 right-8 flex items-center justify-center gap-2 text-sm text-slate-400 group-hover:text-slate-600 transition-colors">
                        <span>Haz clic para ver más</span>
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
                        {/* Estadísticas */}
                        {backContent?.statistics && backContent.statistics.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {backContent.statistics.map((stat, idx) => (
                                    <div key={idx} className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-xs opacity-90 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Detalles */}
                        {backContent?.details && backContent.details.length > 0 && (
                            <div className="flex-1 space-y-2 mb-4 overflow-y-auto">
                                {backContent.details.map((detail, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
                                        <span className="opacity-95">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        {backContent?.cta && (
                            <div className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-auto">
                                {backContent.cta}
                            </div>
                        )}

                        {/* Botón de acción */}
                        {advantage.data?.showButton && advantage.buttonText && advantage.buttonLink && (
                            <a
                                href={advantage.buttonLink}
                                className="mt-4 bg-white text-slate-900 font-semibold py-3 px-6 rounded-lg hover:bg-slate-100 transition-colors text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {advantage.buttonText}
                            </a>
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

export default function PorQueElegirnosSection() {
    const [advantages, setAdvantages] = useState<Advantage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdvantages().then(data => {
            setAdvantages(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-6">
                    <div className="text-center text-slate-600">Cargando ventajas...</div>
                </div>
            </section>
        );
    }

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
                {advantages.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 border border-slate-200 rounded-xl">
                        <p className="text-slate-600 text-lg">No hay ventajas disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {advantages.map((advantage, index) => (
                            <FlipCard key={advantage._id} advantage={advantage} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

