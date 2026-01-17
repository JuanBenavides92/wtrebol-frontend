'use client';

import { motion } from 'framer-motion';

const brands = [
    { name: 'Carrier', logo: '🏢' },
    { name: 'Trane', logo: '🏭' },
    { name: 'Lennox', logo: '🏗️' },
    { name: 'York', logo: '🏛️' },
    { name: 'Daikin', logo: '🏪' },
    { name: 'Mitsubishi', logo: '🏬' },
    { name: 'LG', logo: '📱' },
    { name: 'Samsung', logo: '💼' }
];

export default function MarcasPartnersSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-sky-500 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
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
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Marcas con las que Trabajamos
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Instalamos y damos servicio a las mejores marcas del mercado
                    </p>
                </motion.div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="group"
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center justify-center h-32 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                                <div className="text-5xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">
                                    {brand.logo}
                                </div>
                                <p className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {brand.name}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-300 text-lg">
                        Y muchas más marcas líderes en climatización
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

