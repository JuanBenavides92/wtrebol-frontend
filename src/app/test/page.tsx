'use client';

import { useSlides } from '@/hooks/useContent';

export default function TestPage() {
    const { content: slides, loading, error } = useSlides();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">🔄 Cargando slides...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-red-600">❌ Error</h1>
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">📊 Test: Datos de Sliders desde MongoDB</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                    <p className="text-lg">
                        <strong>Total de slides:</strong> {slides.length}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        Si ves 6 slides aquí, significa que MongoDB está devolviendo todos los datos correctamente.
                    </p>
                </div>

                <div className="space-y-4">
                    {slides
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((slide, index) => (
                            <div
                                key={slide._id}
                                className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Slide #{index + 1} - Order: {slide.order}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {slide.isActive ? '✅ Activo' : '❌ Inactivo'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">ID:</p>
                                        <p className="text-sm text-gray-800 font-mono">{slide._id}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Tipo:</p>
                                        <p className="text-sm text-gray-800">{slide.type}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm font-semibold text-gray-600">Título:</p>
                                        <p className="text-lg text-gray-900 font-semibold">{slide.title}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm font-semibold text-gray-600">Descripción:</p>
                                        <p className="text-sm text-gray-800">{slide.description || 'Sin descripción'}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm font-semibold text-gray-600">Imagen URL:</p>
                                        <p className="text-sm text-gray-800 break-all">
                                            {slide.imageUrl || 'Sin imagen'}
                                        </p>
                                        {slide.imageUrl && (
                                            <div className="mt-2">
                                                <img
                                                    src={slide.imageUrl}
                                                    alt={slide.title}
                                                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '';
                                                        e.currentTarget.alt = '❌ Error cargando imagen';
                                                        e.currentTarget.className = 'w-full max-w-md h-48 flex items-center justify-center bg-red-100 text-red-600 rounded-lg border';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="text-sm font-semibold text-gray-600">Data (JSON):</p>
                                        <pre className="text-xs bg-gray-50 p-4 rounded border overflow-x-auto">
                                            {JSON.stringify(slide.data, null, 2)}
                                        </pre>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Creado:</p>
                                        <p className="text-sm text-gray-800">
                                            {new Date(slide.createdAt).toLocaleString('es-CO')}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-600">Actualizado:</p>
                                        <p className="text-sm text-gray-800">
                                            {new Date(slide.updatedAt).toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {slides.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <p className="text-yellow-800 font-semibold">
                            ⚠️ No se encontraron slides en la base de datos
                        </p>
                        <p className="text-yellow-600 text-sm mt-2">
                            Verifica que existan documentos de tipo "slide" en MongoDB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

