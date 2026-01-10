'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    };

    if (submitted) {
        return (
            <>
                <PageLayout>
                    <div className="flex flex-col items-center justify-center min-h-96">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2">¡Mensaje Enviado!</h2>
                        <p className="text-gray-300 text-lg text-center">
                            Gracias por tu mensaje. Nos comunicaremos contigo pronto.
                        </p>
                    </div>
                </PageLayout>
                <Footer showFooter={true} isStatic={true} />
            </>
        );
    }

    return (
        <>
            <PageLayout>
                <h1 className="text-4xl font-bold text-sky-500 mb-2">Contáctanos</h1>
                <p className="text-gray-400 mb-12 text-lg">Estamos aquí para resolver tus dudas y consultas</p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Información de Contacto</h3>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-6 w-6 text-sky-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Ubicación</h4>
                                <p className="text-gray-400">Colombia - Oficina Central</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                                <Phone className="h-6 w-6 text-sky-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Teléfono</h4>
                                <a href="tel:+573028194432" className="text-sky-400 hover:text-sky-300">
                                    +57 (302) 819-4432
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                                <Mail className="h-6 w-6 text-sky-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Correo Electrónico</h4>
                                <a href="mailto:Wtrebol2020@hotmail.com" className="text-sky-400 hover:text-sky-300">
                                    Wtrebol2020@hotmail.com
                                </a>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/30 rounded-xl p-6 mt-8">
                            <p className="text-gray-300">
                                Nuestro equipo está disponible de lunes a viernes de 8:00 AM a 6:00 PM y sábados de 9:00 AM a 2:00 PM.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Envía tu Mensaje</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Tu Nombre"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Tu Correo"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                            />
                            <textarea
                                name="message"
                                placeholder="Tu Mensaje"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                            />
                            <button
                                type="submit"
                                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-sky-500/20"
                            >
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </PageLayout>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}
