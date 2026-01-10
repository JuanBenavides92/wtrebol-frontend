'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Loader2, Image, Package, Briefcase, Calendar, Users } from 'lucide-react';

interface DashboardStats {
    slides: number;
    products: number;
    services: number;
    appointments: number;
    technicians: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();
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
            // Cargar estadísticas en paralelo
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
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Bienvenido al Dashboard</h2>
                <p className="text-gray-400">Gestiona el contenido de tu sitio web desde aquí</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-sky-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <Image className="h-5 w-5 text-sky-400" />
                        <h3 className="text-sm font-medium text-gray-400">Slides</h3>
                    </div>
                    {loadingStats ? (
                        <Loader2 className="h-6 w-6 text-sky-400 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{stats.slides}</p>
                    )}
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="h-5 w-5 text-emerald-400" />
                        <h3 className="text-sm font-medium text-gray-400">Productos</h3>
                    </div>
                    {loadingStats ? (
                        <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{stats.products}</p>
                    )}
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="h-5 w-5 text-purple-400" />
                        <h3 className="text-sm font-medium text-gray-400">Servicios</h3>
                    </div>
                    {loadingStats ? (
                        <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{stats.services}</p>
                    )}
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-orange-400" />
                        <h3 className="text-sm font-medium text-gray-400">Citas</h3>
                    </div>
                    {loadingStats ? (
                        <Loader2 className="h-6 w-6 text-orange-400 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{stats.appointments}</p>
                    )}
                </div>

                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-pink-400" />
                        <h3 className="text-sm font-medium text-gray-400">Técnicos</h3>
                    </div>
                    {loadingStats ? (
                        <Loader2 className="h-6 w-6 text-pink-400 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold text-white">{stats.technicians}</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <button
                    onClick={() => router.push('/admin/citas')}
                    className="bg-gradient-to-br from-sky-500/10 to-sky-600/10 border border-sky-500/20 rounded-xl p-6 text-left hover:border-sky-500/50 transition-all group"
                >
                    <Calendar className="h-8 w-8 text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-white mb-1">Gestionar Citas</h3>
                    <p className="text-sm text-gray-400">Ver y administrar todas las citas agendadas</p>
                </button>

                <button
                    onClick={() => router.push('/admin/slides')}
                    className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6 text-left hover:border-emerald-500/50 transition-all group"
                >
                    <Image className="h-8 w-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-white mb-1">Editar Slides</h3>
                    <p className="text-sm text-gray-400">Actualizar el carrusel de la página principal</p>
                </button>

                <button
                    onClick={() => router.push('/admin/configuracion')}
                    className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 text-left hover:border-purple-500/50 transition-all group"
                >
                    <LayoutDashboard className="h-8 w-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold text-white mb-1">Configuración</h3>
                    <p className="text-sm text-gray-400">Ajustar configuración del sistema</p>
                </button>
            </div>
        </div>
    );
}
