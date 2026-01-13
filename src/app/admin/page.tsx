'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Loader2,
    Image,
    Package,
    Briefcase,
    Calendar,
    Users,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

interface DashboardStats {
    slides: number;
    products: number;
    services: number;
    appointments: number;
    technicians: number;
}

const statCards = [
    {
        key: 'slides' as keyof DashboardStats,
        title: 'Slides',
        icon: Image,
        gradient: 'from-sky-400 to-blue-500',
        bgGradient: 'from-sky-500/10 to-blue-600/10',
        borderColor: 'border-sky-500/20 hover:border-sky-500/50'
    },
    {
        key: 'products' as keyof DashboardStats,
        title: 'Productos',
        icon: Package,
        gradient: 'from-emerald-400 to-teal-500',
        bgGradient: 'from-emerald-500/10 to-teal-600/10',
        borderColor: 'border-emerald-500/20 hover:border-emerald-500/50'
    },
    {
        key: 'services' as keyof DashboardStats,
        title: 'Servicios',
        icon: Briefcase,
        gradient: 'from-purple-400 to-pink-500',
        bgGradient: 'from-purple-500/10 to-pink-600/10',
        borderColor: 'border-purple-500/20 hover:border-purple-500/50'
    },
    {
        key: 'appointments' as keyof DashboardStats,
        title: 'Citas',
        icon: Calendar,
        gradient: 'from-orange-400 to-red-500',
        bgGradient: 'from-orange-500/10 to-red-600/10',
        borderColor: 'border-orange-500/20 hover:border-orange-500/50'
    },
    {
        key: 'technicians' as keyof DashboardStats,
        title: 'Técnicos',
        icon: Users,
        gradient: 'from-pink-400 to-rose-500',
        bgGradient: 'from-pink-500/10 to-rose-600/10',
        borderColor: 'border-pink-500/20 hover:border-pink-500/50'
    },
];

const quickActions = [
    {
        title: 'Gestionar Citas',
        description: 'Ver y administrar todas las citas agendadas',
        icon: Calendar,
        href: '/admin/citas',
        gradient: 'from-sky-500 to-blue-600',
        bgGradient: 'from-sky-500/10 to-blue-600/10',
        borderColor: 'border-sky-500/20 hover:border-sky-500/50'
    },
    {
        title: 'Editar Slides',
        description: 'Actualizar el carrusel de la página principal',
        icon: Image,
        href: '/admin/slides',
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-500/10 to-teal-600/10',
        borderColor: 'border-emerald-500/20 hover:border-emerald-500/50'
    },
    {
        title: 'Configuración',
        description: 'Ajustar configuración del sistema',
        icon: LayoutDashboard,
        href: '/admin/configuracion',
        gradient: 'from-purple-500 to-pink-600',
        bgGradient: 'from-purple-500/10 to-pink-600/10',
        borderColor: 'border-purple-500/20 hover:border-purple-500/50'
    },
];

const recentActivity = [
    { id: 1, action: 'Nueva cita agendada', time: 'Hace 5 minutos', icon: CheckCircle, color: 'text-emerald-400' },
    { id: 2, action: 'Producto actualizado', time: 'Hace 1 hora', icon: Package, color: 'text-sky-400' },
    { id: 3, action: 'Técnico registrado', time: 'Hace 2 horas', icon: Users, color: 'text-purple-400' },
    { id: 4, action: 'Slide modificado', time: 'Hace 3 horas', icon: Image, color: 'text-orange-400' },
];

export default function AdminDashboard() {
    const router = useRouter();
    const { isLoading, isAuthenticated, user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        slides: 0,
        products: 0,
        services: 0,
        appointments: 0,
        technicians: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadDashboardStats();
        }
    }, [isAuthenticated]);

    const loadDashboardStats = async () => {
        setLoadingStats(true);
        try {
            const [slidesRes, productsRes, servicesRes, appointmentsRes, techniciansRes] = await Promise.all([
                fetch('http://localhost:5000/api/content?type=slide', { credentials: 'include' }),
                fetch('http://localhost:5000/api/content?type=product', { credentials: 'include' }),
                fetch('http://localhost:5000/api/content?type=service', { credentials: 'include' }),
                fetch('http://localhost:5000/api/appointments', { credentials: 'include' }),
                fetch('http://localhost:5000/api/technicians', { credentials: 'include' })
            ]);

            const slides = await slidesRes.json();
            const products = await productsRes.json();
            const services = await servicesRes.json();
            const appointments = await appointmentsRes.json();
            const technicians = await techniciansRes.json();

            setStats({
                slides: slides.data?.length || 0,
                products: products.data?.length || 0,
                services: services.data?.length || 0,
                appointments: appointments.count || 0,
                technicians: technicians.count || 0
            });
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '¡Buenos días';
        if (hour < 18) return '¡Buenas tardes';
        return '¡Buenas noches';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="p-8 space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-white mb-2">
                    {getGreeting()}, {user?.name || 'Administrador'}! 👋
                </h1>
                <p className="text-slate-400 text-lg">
                    Aquí tienes un resumen de tu panel de control
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    const value = stats[card.key];

                    return (
                        <motion.div
                            key={card.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative"
                        >
                            <div className={`
                                h-full bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm
                                border ${card.borderColor} rounded-2xl p-6
                                transition-all duration-300 shadow-lg hover:shadow-2xl
                            `}>
                                {/* Icon */}
                                <div className={`
                                    w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient}
                                    flex items-center justify-center mb-4
                                    group-hover:scale-110 transition-transform duration-300
                                    shadow-lg
                                `}>
                                    <Icon className="h-7 w-7 text-white" />
                                </div>

                                {/* Content */}
                                <div>
                                    <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
                                    {loadingStats ? (
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                    ) : (
                                        <p className="text-3xl font-bold text-white">{value}</p>
                                    )}
                                </div>

                                {/* Trend Indicator */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <motion.button
                                    key={action.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                    onClick={() => router.push(action.href)}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="group relative text-left"
                                >
                                    <div className={`
                                        h-full bg-gradient-to-br ${action.bgGradient} backdrop-blur-sm
                                        border ${action.borderColor} rounded-2xl p-6
                                        transition-all duration-300 shadow-lg hover:shadow-2xl
                                    `}>
                                        <div className={`
                                            w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient}
                                            flex items-center justify-center mb-4
                                            group-hover:scale-110 transition-transform duration-300
                                        `}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                                        <p className="text-sm text-slate-400 mb-4">{action.description}</p>
                                        <div className="flex items-center gap-2 text-sm font-medium text-sky-400 group-hover:gap-3 transition-all">
                                            <span>Ir ahora</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="space-y-4"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Actividad Reciente</h2>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
                        {recentActivity.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                                    className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`h-5 w-5 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{activity.action}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-3 w-3 text-slate-500" />
                                            <p className="text-xs text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
