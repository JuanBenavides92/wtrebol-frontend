'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, Clock, AlertCircle } from 'lucide-react';

export default function EmergenciasSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-red-600 via-orange-600 to-amber-500 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Alert Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="flex justify-center mb-8"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <AlertCircle className="w-12 h-12 text-red-600 animate-pulse" />
                        </div>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                            ¿Emergencia? ¡Estamos Aquí!
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                            Servicio de emergencia 24/7 los 365 días del año
                        </p>
                    </motion.div>

                    {/* Contact Options */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {/* Phone */}
                        <motion.a
                            href="tel:+573028194432"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 font-semibold">Llámanos Ahora</p>
                                        <p className="text-2xl font-bold text-slate-900">+57 (302) 819-4432</p>
                                    </div>
                                </div>
                                <p className="text-slate-600">
                                    Línea directa de emergencias disponible 24/7
                                </p>
                            </div>
                        </motion.a>

                        {/* WhatsApp */}
                        <motion.a
                            href="https://wa.me/573028194432?text=¡Emergencia!%20Necesito%20servicio%20urgente"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <MessageCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 font-semibold">WhatsApp</p>
                                        <p className="text-2xl font-bold text-slate-900">Chat Directo</p>
                                    </div>
                                </div>
                                <p className="text-slate-600">
                                    Respuesta inmediata por WhatsApp
                                </p>
                            </div>
                        </motion.a>
                    </div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid md:grid-cols-3 gap-6"
                    >
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                            <Clock className="w-12 h-12 text-white mx-auto mb-3" />
                            <h3 className="text-white font-bold text-lg mb-2">Respuesta Rápida</h3>
                            <p className="text-white/80 text-sm">Atención en menos de 60 minutos</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                            <AlertCircle className="w-12 h-12 text-white mx-auto mb-3" />
                            <h3 className="text-white font-bold text-lg mb-2">Disponibilidad Total</h3>
                            <p className="text-white/80 text-sm">24 horas, 7 días, 365 días</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                            <Phone className="w-12 h-12 text-white mx-auto mb-3" />
                            <h3 className="text-white font-bold text-lg mb-2">Técnicos Listos</h3>
                            <p className="text-white/80 text-sm">Equipo en standby permanente</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

