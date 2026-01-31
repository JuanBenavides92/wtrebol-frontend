'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const projects = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop',
        title: 'Instalación Residencial',
        category: 'Residencial'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop',
        title: 'Mantenimiento Industrial',
        category: 'Industrial'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1000&auto=format&fit=crop',
        title: 'Servicio Técnico',
        category: 'Mantenimiento'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
        title: 'Climatización Comercial',
        category: 'Comercial'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1595807680548-74d944b90a4d?q=80&w=1000&auto=format&fit=crop',
        title: 'Equipos Disponibles',
        category: 'Productos'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop',
        title: 'Consultoría Profesional',
        category: 'Consultoría'
    },
];

export default function GaleriaPage() {
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
                                Nuestro Trabajo
                            </span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                            Galería de <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">Proyectos</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Conoce algunos de nuestros proyectos exitosos en climatización y refrigeración
                        </p>
                    </motion.div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative rounded-2xl overflow-hidden h-80 cursor-pointer bg-white border-2 border-slate-200 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-500"
                            >
                                {/* Image */}
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <span className="inline-block px-3 py-1 bg-sky-500/90 text-white text-xs font-semibold rounded-full mb-2">
                                            {project.category}
                                        </span>
                                        <h3 className="text-white font-bold text-xl mb-2">
                                            {project.title}
                                        </h3>
                                        <div className="h-1 w-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </motion.div>
                                </div>

                                {/* Hover Border Glow */}
                                <div className="absolute inset-0 rounded-2xl ring-2 ring-sky-400/0 group-hover:ring-sky-400/50 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-block bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-sky-200 rounded-2xl p-8 shadow-lg shadow-sky-100/50">
                            <p className="text-slate-700 text-lg mb-4 font-medium">
                                ¿Tienes un proyecto en mente?
                            </p>
                            <p className="text-slate-600 mb-6">
                                Contáctanos para una consulta gratuita y descubre cómo podemos ayudarte
                            </p>
                            <a
                                href="/contacto"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-sky-400/50 hover:scale-105 transition-all duration-300"
                            >
                                Solicitar Cotización
                            </a>
                        </div>
                    </motion.div>
                </PageLayout>
            </div>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}
