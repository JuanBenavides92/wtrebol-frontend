'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import PageLayout from '@/components/PageLayout';
import { Loader2, CheckCircle2, ShoppingCart, User, MapPin, CreditCard, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';
import { useWompiWidget, openWompiWidget, WompiWidgetConfig } from '@/hooks/useWompiWidget';

interface FormData {
    // Datos personales
    name: string;
    email: string;
    phone: string;
    // Datos de envío
    address: string;
    city: string;
    region: string;
    notes: string;
}

interface OrderData {
    id: string;
    orderNumber: string;
    total: number;
    totalInCents: number;
    currency: string;
    signature: string;
    customerEmail: string;
    customerName: string;
    shippingAddress: any;
}

interface StoreSettings {
    shippingCost: number;
    shippingEnabled: boolean;
    taxVAT: number;
    taxVATEnabled: boolean;
    taxConsumption: number;
    taxConsumptionEnabled: boolean;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalAmount, clearCart } = useCart();
    const { customer, isLoading } = useCustomerAuth();

    // Generar idempotency key única al montar el componente
    const [idempotencyKey, setIdempotencyKey] = useState<string>('');

    useEffect(() => {
        setIdempotencyKey(uuidv4());
    }, []);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [storeSettings, setStoreSettings] = useState<StoreSettings>({
        shippingCost: 0,
        shippingEnabled: false,
        taxVAT: 19,
        taxVATEnabled: true,
        taxConsumption: 0,
        taxConsumptionEnabled: false
    });

    // Cargar script de Wompi
    useWompiWidget();

    // Cargar configuración de la tienda
    useEffect(() => {
        const fetchStoreSettings = async () => {
            try {
                const response = await fetch(API_CONFIG.url('/api/store-settings/public'));
                const result = await response.json();
                if (response.ok && result.success) {
                    setStoreSettings(result.settings);
                }
            } catch (error) {
                console.error('Error fetching store settings:', error);
            }
        };
        fetchStoreSettings();
    }, []);

    const [formData, setFormData] = useState<FormData>({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        address: '',
        city: '',
        region: '',
        notes: ''
    });

    // Actualizar datos del formulario cuando el customer cambie
    useEffect(() => {
        if (customer) {
            setFormData(prev => ({
                ...prev,
                name: customer.name || prev.name,
                email: customer.email || prev.email,
                phone: customer.phone || prev.phone
            }));
        }
    }, [customer]);

    // Verificar autenticación - Redirigir a login si no está autenticado
    useEffect(() => {
        // Solo redirigir si ya terminó de cargar y no hay customer
        if (!isLoading && !customer) {
            // Guardar la ruta actual para redirigir después del login
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            router.push('/customer/login');
        }
    }, [customer, isLoading, router]);

    // Verificar si el carrito está vacío
    if (items.length === 0 && !isSubmitting && !orderData) {
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

    // Calcular impuestos dinámicamente según configuración
    const taxVAT = storeSettings.taxVATEnabled
        ? Math.round(totalAmount * (storeSettings.taxVAT / 100))
        : 0;
    const taxConsumption = storeSettings.taxConsumptionEnabled
        ? Math.round(totalAmount * (storeSettings.taxConsumption / 100))
        : 0;
    const shippingCost = storeSettings.shippingEnabled ? storeSettings.shippingCost : 0;
    const total = totalAmount + taxVAT + taxConsumption + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            if (!formData.region.trim()) newErrors.region = 'La región/departamento es requerido';
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

    const createOrder = async () => {
        if (!validateStep(2)) return;

        setIsSubmitting(true);
        setPaymentError(null);

        try {
            const orderPayload = {
                idempotencyKey, // Llave de idempotencia para prevenir duplicados
                customerId: customer?.id || 'guest',
                customerEmail: formData.email,
                customerName: formData.name,
                customerPhone: formData.phone,
                items: items.map(item => ({
                    productId: item.productId,
                    title: item.title,
                    price: item.price,
                    priceNumeric: item.priceNumeric,
                    quantity: item.quantity,
                    subtotal: item.priceNumeric * item.quantity,
                    imageUrl: item.imageUrl,
                    category: item.category,
                    btuCapacity: item.btuCapacity
                })),
                shippingInfo: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    notes: formData.notes
                }
            };

            console.log('📦 Creating order with idempotency key:', idempotencyKey);

            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.CREATE_ORDER), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(orderPayload)
            });

            const result = await response.json();
            console.log('📦 Order response:', result);

            if (response.ok && result.success) {
                if (result.isDuplicate) {
                    console.log('⚠️ Pedido duplicado detectado, usando pedido existente');
                }
                setOrderData(result.order);
                setCurrentStep(3); // Ir al paso de pago
            } else {
                setPaymentError(result.message || 'Error al crear la orden');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('❌ Error creating order:', error);
            setPaymentError('Error al procesar la orden. Por favor intenta de nuevo.');
            setIsSubmitting(false);
        }
    };

    const handlePayment = () => {
        if (!orderData) {
            setPaymentError('No se pudo cargar la información de la orden');
            return;
        }

        setPaymentError(null);

        console.log('📦 Order Data received from backend:', orderData);
        console.log('💰 Total in cents:', orderData.totalInCents);
        console.log('📝 Reference:', orderData.orderNumber);
        console.log('🔐 Signature from backend:', orderData.signature);

        const wompiConfig: WompiWidgetConfig = {
            currency: 'COP',
            amountInCents: orderData.totalInCents,
            reference: orderData.orderNumber,
            publicKey: 'pub_test_mZwqsVoRlKr1VtkrAQpGnuDuCtCSTBNv', // Sandbox/Test
            signature: {
                integrity: orderData.signature
            }
            // Removido redirectUrl temporalmente para testing
        };

        console.log('💳 Opening Wompi Widget with config:', wompiConfig);

        openWompiWidget(
            wompiConfig,
            async (response) => {
                console.log('✅ Payment successful:', response);

                // Si hay información de transacción, actualizar el estado
                if (response.transaction) {
                    const transaction = response.transaction;
                    console.log('Transaction ID:', transaction.id);
                    console.log('Transaction status:', transaction.status);

                    // Si el pago fue aprobado, actualizar el estado de la orden
                    if (transaction.status === 'APPROVED') {
                        try {
                            console.log('✅ Payment approved! Updating order status...');

                            // Capturar datos detallados de la transacción
                            const paymentData: any = {
                                transactionId: transaction.id,
                                paymentStatus: 'approved',
                                paymentMethod: transaction.payment_method_type
                            };

                            // Capturar datos de tarjeta si están disponibles
                            if (transaction.payment_method) {
                                const paymentMethod = transaction.payment_method;

                                if (paymentMethod.type === 'CARD') {
                                    paymentData.cardBrand = paymentMethod.extra?.brand || paymentMethod.extra?.franchise;
                                    paymentData.cardLast4 = paymentMethod.extra?.last_four;
                                }
                            }

                            // Código de aprobación
                            if (transaction.status_message) {
                                paymentData.approvalCode = transaction.status_message;
                            }

                            // Enlace al recibo de Wompi
                            paymentData.paymentLink = `https://comercios.wompi.co/transactions/${transaction.id}`;

                            console.log('📦 Payment data to send:', paymentData);

                            const updateResponse = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderData.id}/payment`), {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    transactionId: transaction.id,
                                    paymentStatus: 'approved',
                                    paymentMethod: transaction.payment_method_type
                                })
                            });

                            const updateResult = await updateResponse.json();

                            if (updateResult.success) {
                                console.log('✅ Order status updated successfully');
                            } else {
                                console.error('❌ Failed to update order status:', updateResult.message);
                            }
                        } catch (error) {
                            console.error('❌ Error updating order status:', error);
                        }
                    }
                }

                // Limpiar carrito
                clearCart();
                // Redirigir a página de confirmación
                router.push(`/order/confirmation/${orderData.id}`);
            },
            (error) => {
                console.error('❌ Payment error:', error);
                setPaymentError('Error al procesar el pago. Por favor intenta de nuevo.');
            }
        );
    };

    const steps = [
        { number: 1, title: 'Datos Personales', icon: User },
        { number: 2, title: 'Datos de Envío', icon: MapPin },
        { number: 3, title: 'Pago', icon: CreditCard }
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

                    {/* Error Alert */}
                    {paymentError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-500 font-medium">Error</p>
                                <p className="text-red-400 text-sm">{paymentError}</p>
                            </div>
                        </div>
                    )}

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
                                                placeholder="300 123 4567"
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

                                        <div className="grid grid-cols-2 gap-4">
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
                                                    Departamento *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="region"
                                                    value={formData.region}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 bg-white/5 border ${errors.region ? 'border-red-500' : 'border-white/10'
                                                        } rounded-lg text-white focus:outline-none focus:border-sky-500`}
                                                    placeholder="Cundinamarca"
                                                />
                                                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                                            </div>
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

                                {/* Step 3: Pago */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white mb-6">Proceder al Pago</h2>

                                        {/* Resumen de Datos */}
                                        <div className="space-y-4 mb-6">
                                            <div className="border-b border-white/10 pb-4">
                                                <h3 className="font-semibold text-white mb-3">Datos Personales</h3>
                                                <div className="space-y-2 text-gray-300 text-sm">
                                                    <p><span className="text-gray-400">Nombre:</span> {formData.name}</p>
                                                    <p><span className="text-gray-400">Email:</span> {formData.email}</p>
                                                    <p><span className="text-gray-400">Teléfono:</span> {formData.phone}</p>
                                                </div>
                                            </div>

                                            <div className="border-b border-white/10 pb-4">
                                                <h3 className="font-semibold text-white mb-3">Datos de Envío</h3>
                                                <div className="space-y-2 text-gray-300 text-sm">
                                                    <p><span className="text-gray-400">Dirección:</span> {formData.address}</p>
                                                    <p><span className="text-gray-400">Ciudad:</span> {formData.city}, {formData.region}</p>
                                                    {formData.notes && (
                                                        <p><span className="text-gray-400">Notas:</span> {formData.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información de Pago */}
                                        <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-6">
                                            <div className="flex items-start gap-3 mb-4">
                                                <CreditCard className="h-6 w-6 text-sky-400 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-semibold text-white mb-2">Pago Seguro con Wompi</h3>
                                                    <p className="text-gray-300 text-sm mb-4">
                                                        Al hacer clic en "Pagar Ahora", se abrirá una ventana segura de Wompi donde podrás completar tu pago con:
                                                    </p>
                                                    <ul className="text-gray-300 text-sm space-y-1 ml-4">
                                                        <li>• Tarjetas de crédito/débito</li>
                                                        <li>• PSE (Pagos Seguros en Línea)</li>
                                                        <li>• Nequi</li>
                                                        <li>• Otros métodos disponibles</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {orderData && (
                                            <div className="text-center">
                                                <p className="text-gray-400 text-sm mb-4">
                                                    Orden #{orderData.orderNumber} creada exitosamente
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentStep === 1 || isSubmitting}
                                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                        Anterior
                                    </button>

                                    {currentStep < 2 ? (
                                        <button
                                            onClick={handleNext}
                                            className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                                        >
                                            Siguiente
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    ) : currentStep === 2 ? (
                                        <button
                                            onClick={createOrder}
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Creando Orden...
                                                </>
                                            ) : (
                                                'Continuar al Pago'
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handlePayment}
                                            disabled={!orderData}
                                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                                        >
                                            <CreditCard className="h-5 w-5" />
                                            Pagar Ahora
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
                                    {storeSettings.taxVATEnabled && (
                                        <div className="flex justify-between text-gray-300">
                                            <span>IVA ({storeSettings.taxVAT}%)</span>
                                            <span>{formatPrice(taxVAT)}</span>
                                        </div>
                                    )}
                                    {storeSettings.taxConsumptionEnabled && taxConsumption > 0 && (
                                        <div className="flex justify-between text-gray-300">
                                            <span>Imp. Consumo ({storeSettings.taxConsumption}%)</span>
                                            <span>{formatPrice(taxConsumption)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-300">
                                        <span>Envío</span>
                                        {storeSettings.shippingEnabled ? (
                                            <span>{formatPrice(shippingCost)}</span>
                                        ) : (
                                            <span className="text-emerald-400">GRATIS</span>
                                        )}
                                    </div>
                                    <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-emerald-500">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Productos */}
                                <div className="border-t border-white/10 pt-4">
                                    <h4 className="text-sm font-semibold text-white mb-3">Productos</h4>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {items.map((item) => (
                                            <div key={item.productId} className="flex items-center gap-3 text-sm">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white truncate">{item.title}</p>
                                                    <p className="text-gray-400">x{item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4 mt-4">
                                    <p className="text-xs text-gray-400 text-center">
                                        🔒 Pago seguro con Wompi
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
