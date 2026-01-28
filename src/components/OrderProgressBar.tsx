'use client';

import { Clock, CheckCircle, Package, Truck, Home } from 'lucide-react';

interface OrderProgressBarProps {
    currentStatus: 'pending_payment' | 'payment_confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
}

const steps = [
    { key: 'pending_payment', label: 'Pendiente de Pago', icon: Clock },
    { key: 'payment_confirmed', label: 'Pago Confirmado', icon: CheckCircle },
    { key: 'preparing', label: 'En Preparación', icon: Package },
    { key: 'shipped', label: 'En Camino', icon: Truck },
    { key: 'delivered', label: 'Entregado', icon: Home }
];

export default function OrderProgressBar({ currentStatus }: OrderProgressBarProps) {
    // Si está cancelado, mostrar mensaje especial
    if (currentStatus === 'cancelled') {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <p className="text-red-400 text-center font-medium">Este pedido ha sido cancelado</p>
            </div>
        );
    }

    const currentIndex = steps.findIndex(step => step.key === currentStatus);

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
            <h3 className="text-xl font-bold text-white mb-6">Estado del Pedido</h3>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={step.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                                {/* Icon Circle */}
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-3
                                    ${isCompleted
                                        ? 'bg-gradient-to-br from-blue-500 to-emerald-500 border-transparent shadow-lg shadow-blue-500/50'
                                        : 'bg-white/5 border-white/20'
                                    }
                                    ${isCurrent ? 'scale-110 ring-4 ring-blue-500/30' : ''}
                                `}>
                                    <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                                </div>

                                {/* Label */}
                                <p className={`
                                    text-center text-sm font-medium transition-colors
                                    ${isCompleted ? 'text-white' : 'text-gray-500'}
                                    ${isCurrent ? 'font-bold' : ''}
                                `}>
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
