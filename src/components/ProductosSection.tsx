export default function ProductosSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
                    Productos Destacados
                </h2>
                <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                    Equipos de aire acondicionado de las mejores marcas
                </p>

                {/* Placeholder for product cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="h-48 bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
                                <span className="text-6xl">❄️</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-slate-900">
                                    Producto {item}
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    Descripción del producto destacado
                                </p>
                                <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl font-bold hover:scale-105 transition-all duration-300">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
