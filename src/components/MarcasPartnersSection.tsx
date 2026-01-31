'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const brands = [
    {
        name: 'CARRIER',
        color: '#0080C9',
        description: 'Líder mundial en climatización'
    },
    {
        name: 'DAIKIN',
        color: '#005BAC',
        description: 'Innovación japonesa en HVAC'
    },
    {
        name: 'LG',
        color: '#A50034',
        description: 'Tecnología de vanguardia'
    },
    {
        name: 'MITSUBISHI',
        color: '#E60012',
        description: 'Excelencia en climatización'
    },
    {
        name: 'TRANE',
        color: '#C8102E',
        description: 'Confiabilidad comprobada'
    },
    {
        name: 'YORK',
        color: '#003B5C',
        description: 'Tradición y calidad'
    },
    {
        name: 'LENNOX',
        color: '#E31837',
        description: 'Eficiencia energética'
    },
    {
        name: 'FUJITSU',
        color: '#E60012',
        description: 'Tecnología avanzada'
    },
    {
        name: 'PANASONIC',
        color: '#0062AF',
        description: 'Innovación sostenible'
    },
    {
        name: 'SAMSUNG',
        color: '#1428A0',
        description: 'Innovación tecnológica'
    },
    {
        name: 'GREE',
        color: '#00A651',
        description: 'Eficiencia superior'
    },
    {
        name: 'RHEEM',
        color: '#E31837',
        description: 'Calidad americana'
    }
];

function BrandCard({ brand, index }: { brand: typeof brands[0], index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Container */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden h-36 flex items-center justify-center">
                {/* Glow Effect on Hover */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: `radial-gradient(circle at 50% 100%, ${brand.color}50 0%, transparent 70%)`
                    }}
                />

                {/* Bottom Light Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: isHovered ? '4px' : '0px',
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: `linear-gradient(90deg, transparent, ${brand.color}, transparent)`,
                        boxShadow: `0 0 30px ${brand.color}`
                    }}
                />

                {/* Brand Name */}
                <motion.div
                    className="relative z-10 text-center"
                    animate={{
                        scale: isHovered ? 1.05 : 1,
                        y: isHovered ? -5 : 0
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <h3
                        className="text-2xl md:text-3xl font-black tracking-wider transition-all duration-500"
                        style={{
                            color: isHovered ? brand.color : '#94a3b8',
                            textShadow: isHovered ? `0 0 20px ${brand.color}80` : 'none'
                        }}
                    >
                        {brand.name}
                    </h3>
                </motion.div>

                {/* Hover Description */}
                <motion.div
                    className="absolute inset-0 flex items-end justify-center pb-3 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-white/80 text-xs font-medium text-center px-2">
                        {brand.description}
                    </p>
                </motion.div>
            </div>

            {/* Floating Particles on Hover */}
            <motion.div
                className="absolute -inset-1 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="absolute top-0 left-1/4 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: brand.color }}
                    animate={{
                        y: isHovered ? [-10, -25, -10] : 0,
                        opacity: isHovered ? [0, 1, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-0 right-1/4 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: brand.color }}
                    animate={{
                        y: isHovered ? [-10, -25, -10] : 0,
                        opacity: isHovered ? [0, 1, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.div
                    className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: brand.color }}
                    animate={{
                        y: isHovered ? [-10, -25, -10] : 0,
                        opacity: isHovered ? [0, 1, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
            </motion.div>
        </motion.div>
    );
}

export default function MarcasPartnersSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-4"
                    >
                        <span className="px-6 py-2 bg-gradient-to-r from-sky-500/20 to-blue-500/20 border border-sky-500/30 rounded-full text-sky-400 font-semibold text-sm tracking-wider uppercase">
                            Marcas Premium
                        </span>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Marcas con las que <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">Trabajamos</span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Instalamos y brindamos servicio técnico especializado a las marcas más reconocidas del mercado
                    </p>
                </motion.div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {brands.map((brand, index) => (
                        <BrandCard key={brand.name} brand={brand} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
