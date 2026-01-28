'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Loader2, MapPin, Phone, Mail, User, Clock, Edit2, Check, X, CreditCard, ExternalLink, CheckCircle, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/whatsapp';

interface OrderItem {
    productId: string;
    title: string;
    price: string;
    priceNumeric: number;
    quantity: number;
    imageUrl?: string;
}

interface ShippingInfo {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerId: string;
    total: number;
    subtotal: number;
    shipping: number;
    status: string;
    paymentStatus?: string;
    createdAt: string;
    paidAt?: string;
    items: OrderItem[];
    shippingInfo: ShippingInfo;
    notes?: string;
    // Wompi payment data
    wompiTransactionId?: string;
    wompiPaymentMethod?: string;
    wompiCardBrand?: string;
    wompiCardLast4?: string;
    wompiApprovalCode?: string;
    wompiPaymentLink?: string;
}

interface StatusHistoryItem {
    _id: string;
    previousStatus: string;
    newStatus: string;
    notes?: string;
    changedBy: string;
    createdAt: string;
}

const STATUS_OPTIONS = [
    { value: 'payment_confirmed', label: 'Pago Confirmado', color: 'bg-green-500', icon: CheckCircle },
    { value: 'preparing', label: 'En Preparación', color: 'bg-blue-500', icon: Package },
    { value: 'shipped', label: 'Enviado', color: 'bg-purple-500', icon: Truck },
    { value: 'delivered', label: 'Entregado', color: 'bg-emerald-500', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-500', icon: XCircle }
];

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusNotes, setStatusNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ADMIN_ORDERS}/${orderId}`), {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setOrder(data.order);
                    setStatusHistory(data.statusHistory || []);
                    setNewStatus(data.order.status);
                }
            } else {
                router.push('/admin/pedidos');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            router.push('/admin/pedidos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!order || newStatus === order.status) {
            setIsEditingStatus(false);
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(
                API_CONFIG.url(`${API_CONFIG.ENDPOINTS.ADMIN_ORDERS}/${orderId}/status`),
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        status: newStatus,
                        notes: statusNotes
                    })
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    await fetchOrderDetail();
                    setIsEditingStatus(false);
                    setStatusNotes('');
                }
            } else {
                alert('Error al actualizar el estado');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-8">
                <div className="text-center py-20">
                    <Package className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Pedido no encontrado</h2>
                    <Link
                        href="/admin/pedidos"
                        className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a pedidos
                    </Link>
                </div>
            </div>
        );
    }

    const currentStatusOption = STATUS_OPTIONS.find(s => s.value === order.status);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/pedidos"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a pedidos
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Pedido #{order.orderNumber}
                        </h1>
                        <p className="text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Status Badge/Editor */}
                    <div>
                        {!isEditingStatus ? (
                            <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold border ${currentStatusOption?.color || 'bg-gray-500'} border-white/20`}>
                                    {currentStatusOption?.icon && <currentStatusOption.icon className="h-4 w-4" />}
                                    {currentStatusOption?.label || order.status}
                                </span>
                                <button
                                    onClick={() => setIsEditingStatus(true)}
                                    className="p-2 hover:bg-slate-800/30 rounded-lg transition-colors group"
                                    title="Cambiar estado"
                                >
                                    <Edit2 className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="appearance-none px-4 py-2.5 pr-10 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500/50 transition-all cursor-pointer"
                                    >
                                        {STATUS_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={isSaving || newStatus === order.status}
                                    className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
                                    title="Guardar"
                                >
                                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditingStatus(false);
                                        setNewStatus(order.status);
                                        setStatusNotes('');
                                    }}
                                    disabled={isSaving}
                                    className="p-2.5 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Cancelar"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Notes Input */}
                {isEditingStatus && (
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Notas opcionales sobre el cambio de estado..."
                            value={statusNotes}
                            onChange={(e) => setStatusNotes(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
                        />
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información del Cliente
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Nombre</p>
                                <p className="font-semibold text-white">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Email</p>
                                <p className="font-semibold text-white">{order.customerEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Productos</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                                    {item.imageUrl && (
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Precio unitario</p>
                                        <p className="font-semibold text-white">{item.price}</p>
                                        <p className="text-sm text-emerald-400 font-semibold">
                                            {formatPrice(item.priceNumeric * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Información de Envío
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400">Nombre</p>
                                    <p className="text-white">{order.shippingInfo.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400">Teléfono</p>
                                    <p className="text-white">{order.shippingInfo.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400">Dirección</p>
                                    <p className="text-white">{order.shippingInfo.address}</p>
                                    <p className="text-gray-400">{order.shippingInfo.city}</p>
                                </div>
                            </div>
                            {order.shippingInfo.notes && (
                                <div className="flex items-start gap-3">
                                    <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-400">Notas</p>
                                        <p className="text-white">{order.shippingInfo.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Resumen</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-300">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Envío</span>
                                <span className={order.shipping === 0 ? 'text-emerald-400' : ''}>
                                    {order.shipping === 0 ? 'GRATIS' : formatPrice(order.shipping)}
                                </span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span className="text-emerald-400">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Receipt */}
                    {order.paymentStatus === 'approved' && order.wompiTransactionId && (
                        <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Comprobante de Pago
                            </h2>
                            <div className="space-y-3">
                                {/* Payment Status */}
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span className="text-sm font-semibold text-green-400">Pago Aprobado</span>
                                </div>

                                {/* Transaction ID */}
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">ID de Transacción</p>
                                    <p className="text-sm font-mono text-white break-all">{order.wompiTransactionId}</p>
                                </div>

                                {/* Payment Method */}
                                {order.wompiPaymentMethod && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Método de Pago</p>
                                        <p className="text-sm text-white capitalize">{order.wompiPaymentMethod}</p>
                                    </div>
                                )}

                                {/* Card Info */}
                                {order.wompiCardBrand && order.wompiCardLast4 && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Tarjeta</p>
                                        <p className="text-sm text-white">
                                            {order.wompiCardBrand} •••• {order.wompiCardLast4}
                                        </p>
                                    </div>
                                )}

                                {/* Approval Code */}
                                {order.wompiApprovalCode && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Código de Aprobación</p>
                                        <p className="text-sm font-mono text-white">{order.wompiApprovalCode}</p>
                                    </div>
                                )}

                                {/* Payment Date */}
                                {order.paidAt && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Fecha de Pago</p>
                                        <p className="text-sm text-white">
                                            {new Date(order.paidAt).toLocaleString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                )}

                                {/* Link to Wompi Receipt */}
                                {order.wompiPaymentLink && (
                                    <a
                                        href={order.wompiPaymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all text-sm font-medium"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Ver Recibo Oficial
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Status History */}
                    {statusHistory.length > 0 && (
                        <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Historial
                            </h2>
                            <div className="space-y-3">
                                {statusHistory.map((history, index) => {
                                    const statusOption = STATUS_OPTIONS.find(s => s.value === history.newStatus);
                                    return (
                                        <div key={history._id} className="relative pl-6 pb-3 last:pb-0">
                                            {index < statusHistory.length - 1 && (
                                                <div className="absolute left-2 top-6 bottom-0 w-px bg-white/10"></div>
                                            )}
                                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${statusOption?.color || 'bg-gray-500'}`}></div>
                                            <p className="text-sm font-semibold text-white">
                                                {statusOption?.label || history.newStatus}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(history.createdAt).toLocaleString('es-ES')}
                                            </p>
                                            {history.notes && (
                                                <p className="text-xs text-gray-500 mt-1">{history.notes}</p>
                                            )}
                                            <p className="text-xs text-gray-500">Por: {history.changedBy}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
