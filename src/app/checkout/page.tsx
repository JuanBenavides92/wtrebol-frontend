'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import PageLayout from '@/components/PageLayout';
import { Loader2, CheckCircle2, ShoppingCart, User, MapPin, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';

interface FormData {
    // Datos personales
    name: string;
    email: string;
    phone: string;
    // Datos de envío
    address: string;
    city: string;
    notes: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalAmount, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
    });

    // Verificar si el carrito está vacío
    if (items.length === 0 && !isSubmitting) {
        return (
            <PageLayout>
                <div className="min-h-screen py-20">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <ShoppingCart className="h-24 w-24 text-gray-600 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h1>
                        <p className="text-gray-400 mb-8">Agrega productos al carrito antes de proceder al checkout</p>
                        <Link
                            href="/tienda"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Ir a la Tienda
                        </Link>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const shippingCost = 0; // Envío gratis por ahora
    const total = totalAmount + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<FormData> = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
            if (!formData.email.trim()) {
                newErrors.email = 'El email es requerido';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Email inválido';
            }
            if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
        }

        if (step === 2) {
            if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
            if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(2)) return;

        setIsSubmitting(true);

        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    title: item.title,
                    price: item.price,
                    priceNumeric: item.priceNumeric,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl,
                    category: item.category,
                    btuCapacity: item.btuCapacity
                })),
                subtotal: totalAmount,
                shipping: shippingCost,
                total: total,
                shippingInfo: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    notes: formData.notes
                },
                notes: formData.notes
            };

            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.ORDERS), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Limpiar carrito
                clearCart();
                // Redirect a página de éxito
                router.push(`/checkout/success?orderId=${result.order.id}&orderNumber=${result.order.orderNumber}`);
            } else {
                alert(result.message || 'Error al crear el pedido');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error al crear pedido:', error);
            alert('Error al procesar el pedido');
            setIsSubmitting(false);
        }
    };

    const steps = [
        { number: 1, title: 'Datos Personales', icon: User },
        { number: 2, title: 'Datos de Envío', icon: MapPin },
        { number: 3, title: 'Confirmación', icon: FileText }
    ];

    return (
        <PageLayout>
            <div className="min-h-screen py-20">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/tienda"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a la tienda
                        </Link>
                        <h1 className="text-4xl font-bold text-white">Finalizar Compra</h1>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-center gap-4">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep >= step.number
                                                ? 'bg-sky-500 text-white'
                                                : 'bg-white/10 text-gray-400'
                                            }`}>
                                            {currentStep > step.number ? (
                                                <CheckCircle2 className="h-6 w-6" />
                                            ) : (
                                                <step.icon className="h-6 w-6" />
                                            )}
                                        </div>
                                        <span className={`text-sm mt-2 ${currentStep >= step.number ? 'text-white' : 'text-gray-400'
                                            }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-24 h-1 mx-4 ${currentStep > step.number ? 'bg-sky-500' : 'bg-white/10'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                {/* Step 1: Datos Personales */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white mb-6">Datos Personales</h2>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'
                                                    } rounded-lg text-white focus:outline-none focus:border-sky-500`}
                                                placeholder="Juan Pérez"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'
                                                    } rounded-lg text-white focus:outline-none focus:border-sky-500`}
                                                placeholder="juan@ejemplo.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Teléfono *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'
                                                    } rounded-lg text-white focus:outline-none focus:border-sky-500`}
                                                placeholder="+57 300 123 4567"
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Datos de Envío */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white mb-6">Datos de Envío</h2>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Dirección *
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.address ? 'border-red-500' : 'border-white/10'
                                                    } rounded-lg text-white focus:outline-none focus:border-sky-500`}
                                                placeholder="Calle 123 #45-67"
                                            />
                                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'
                                                    } rounded-lg text-white focus:outline-none focus:border-sky-500`}
                                                placeholder="Bogotá"
                                            />
                                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Notas Adicionales (Opcional)
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
                                                placeholder="Instrucciones especiales de entrega..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Confirmación */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white mb-6">Confirmar Pedido</h2>

                                        {/* Datos Personales Summary */}
                                        <div className="border-b border-white/10 pb-4">
                                            <h3 className="font-semibold text-white mb-3">Datos Personales</h3>
                                            <div className="space-y-2 text-gray-300">
                                                <p><span className="text-gray-400">Nombre:</span> {formData.name}</p>
                                                <p><span className="text-gray-400">Email:</span> {formData.email}</p>
                                                <p><span className="text-gray-400">Teléfono:</span> {formData.phone}</p>
                                            </div>
                                        </div>

                                        {/* Datos de Envío Summary */}
                                        <div className="border-b border-white/10 pb-4">
                                            <h3 className="font-semibold text-white mb-3">Datos de Envío</h3>
                                            <div className="space-y-2 text-gray-300">
                                                <p><span className="text-gray-400">Dirección:</span> {formData.address}</p>
                                                <p><span className="text-gray-400">Ciudad:</span> {formData.city}</p>
                                                {formData.notes && (
                                                    <p><span className="text-gray-400">Notas:</span> {formData.notes}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Productos Summary */}
                                        <div>
                                            <h3 className="font-semibold text-white mb-3">Productos ({items.length})</h3>
                                            <div className="space-y-3">
                                                {items.map((item) => (
                                                    <div key={item.productId} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                                            <Image
                                                                src={item.imageUrl}
                                                                alt={item.title}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-white font-medium">{item.title}</p>
                                                            <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-emerald-400 font-semibold">{item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentStep === 1}
                                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                        Anterior
                                    </button>

                                    {currentStep < 3 ? (
                                        <button
                                            onClick={handleNext}
                                            className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                                        >
                                            Siguiente
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Procesando...
                                                </>
                                            ) : (
                                                'Confirmar Pedido'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                                        <span>{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Envío</span>
                                        <span className="text-emerald-400">GRATIS</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-emerald-500">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4">
                                    <p className="text-sm text-gray-400">
                                        💳 Los pagos se coordinan directamente con nuestro equipo
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
