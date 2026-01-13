export default function ServiciosSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
                    Nuestros Servicios
                </h2>
                <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                    Soluciones profesionales de aire acondicionado para tu hogar o negocio
                </p>

                {/* Placeholder for service cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Mantenimiento', icon: '🔧' },
                        { title: 'Instalación', icon: '⚙️' },
                        { title: 'Reparación', icon: '🛠️' },
                    ].map((service, index) => (
                        <div
                            key={index}
                            className="p-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-5xl mb-4">{service.icon}</div>
                            <h3 className="text-2xl font-bold mb-2 text-slate-900">{service.title}</h3>
                            <p className="text-slate-600">
                                Servicio profesional de {service.title.toLowerCase()} de aire acondicionado
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
