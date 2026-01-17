import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-sky-500 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    ¿Listo para agendar tu cita?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Agenda tu servicio de aire acondicionado hoy mismo y disfruta de un ambiente fresco y confortable
                </p>
                <Link
                    href="/calendario"
                    className="inline-block px-10 py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
                >
                    Agendar Cita Ahora
                </Link>
            </div>
        </section>
    );
}

