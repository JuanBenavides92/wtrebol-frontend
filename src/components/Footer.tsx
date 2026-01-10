'use client';

import Link from 'next/link';

interface FooterProps {
    showFooter: boolean;
    isStatic?: boolean; // Nueva prop para modo estático
}

export default function Footer({ showFooter, isStatic = false }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Galería', href: '/galeria' },
        { name: 'Tienda', href: '/tienda' },
        { name: 'Contacto', href: '/contacto' },
    ];

    const socialLinks = [
        { name: 'Facebook', icon: '📘', url: 'https://facebook.com' },
        { name: 'Instagram', icon: '📷', url: 'https://instagram.com' },
        { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
        { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/1234567890' },
    ];

    return (
        <footer
            className={`w-full flex flex-col justify-center items-center overflow-hidden ${isStatic
                ? 'relative'
                : `fixed bottom-0 left-0 transition-transform duration-700 ease-out ${showFooter ? 'translate-y-0' : 'translate-y-full'}`
                }`}
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                zIndex: isStatic ? 10 : 30,
            }}
        >
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Logo and Description */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">W</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">W Trebol</h3>
                                <p className="text-sm text-sky-400">Innovación</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Líderes en soluciones de climatización, refrigeración y obra civil.
                            Innovación y calidad en cada proyecto.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-sky-400 transition-colors duration-300 text-sm group flex items-center gap-2"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-sky-400 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm">
                                <span className="text-sky-400 text-lg">📞</span>
                                <div>
                                    <p className="text-gray-400">Teléfono</p>
                                    <a href="tel:+573028194432" className="text-white hover:text-sky-400 transition-colors">
                                        +57 (302) 819-4432
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <span className="text-sky-400 text-lg">✉️</span>
                                <div>
                                    <p className="text-gray-400">Email</p>
                                    <a href="mailto:Wtrebol2020@hotmail.com" className="text-white hover:text-sky-400 transition-colors">
                                        Wtrebol2020@hotmail.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <span className="text-sky-400 text-lg">📍</span>
                                <div>
                                    <p className="text-gray-400">Dirección</p>
                                    <p className="text-white">
                                        Colombia<br />
                                        Oficina Central
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white">Síguenos</h4>
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative"
                                    aria-label={social.name}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300 group-hover:scale-110">
                                        <span className="text-2xl">{social.icon}</span>
                                    </div>
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {social.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                        <div className="pt-6">
                            <p className="text-sm text-gray-400 mb-3">Horario de atención</p>
                            <p className="text-white text-sm">
                                Lunes - Viernes: 8:00 AM - 6:00 PM<br />
                                Sábados: 9:00 AM - 2:00 PM
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} W Trebol Innovación. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <button className="text-gray-400 hover:text-sky-400 transition-colors">
                            Política de Privacidad
                        </button>
                        <button className="text-gray-400 hover:text-sky-400 transition-colors">
                            Términos y Condiciones
                        </button>
                        <Link
                            href="/admin/login"
                            className="text-gray-400 hover:text-sky-400 transition-colors font-medium"
                        >
                            Administrar
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll indicator - only show in animated mode */}
            {!isStatic && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <p className="text-gray-400 text-xs">Volver arriba</p>
                    <svg
                        className="w-6 h-6 text-sky-400 rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            )}
        </footer>
    );
}
