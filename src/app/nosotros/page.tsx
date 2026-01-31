'use client';

import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function NosotrosPage() {
    const values = ['Superación', 'Creatividad', 'Innovación', 'Lealtad'];

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
                                Nuestra Empresa
                            </span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                            Sobre <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">Nosotros</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Líderes en soluciones integrales de climatización y refrigeración en Colombia
                        </p>
                    </motion.div>

                    {/* Mission & Vision Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-200/40 transition-all duration-500"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                    M
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Misión</h3>
                            </div>
                            <p className="text-slate-700 leading-relaxed text-lg">
                                Brindar soluciones integrales a nuestros clientes fomentando la cultura de la sostenibilidad en el tiempo y siendo inclusivos en cada proceso realizado.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/40 transition-all duration-500"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                    V
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Visión 2026</h3>
                            </div>
                            <p className="text-slate-700 leading-relaxed text-lg">
                                Ser una empresa posicionada y competitiva destacada por nuestra innovación, atención personalizada y compromiso con el cambio social.
                            </p>
                        </motion.div>
                    </div>

                    {/* Values Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-16"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Valores Corporativos</h3>
                        <div className="flex gap-4 flex-wrap justify-center">
                            {values.map((value, index) => (
                                <motion.span
                                    key={value}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                    className="px-8 py-4 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 rounded-full border-2 border-sky-300 font-semibold text-lg hover:shadow-lg hover:shadow-sky-200/50 hover:scale-105 transition-all duration-300 cursor-default"
                                >
                                    {value}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Company Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-sky-200 rounded-2xl p-10 shadow-lg shadow-sky-100/50"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">WTREBOL S.A.S</h3>
                                <p className="text-slate-700 text-lg leading-relaxed">
                                    WTREBOL es una empresa colombiana especializada en soluciones integrales de climatización, refrigeración y servicios técnicos. Con años de experiencia en el mercado, nos hemos posicionado como líderes en innovación y atención personalizada para nuestros clientes residenciales, comerciales e industriales.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </PageLayout>
            </div>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}
