'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import Link from 'next/link';
import { Package, User, LogOut, Loader2 } from 'lucide-react';

export default function CustomerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { customer, isLoading, isAuthenticated, logout } = useCustomerAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/customer/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !customer) {
        return null;
    }

    const menuItems = [
        {
            label: 'Mis Pedidos',
            href: '/customer/dashboard',
            icon: Package,
            active: pathname === '/customer/dashboard' || pathname?.startsWith('/customer/dashboard/orders')
        },
        {
            label: 'Mi Perfil',
            href: '/customer/dashboard/profile',
            icon: User,
            active: pathname === '/customer/dashboard/profile'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Top Header */}
            <header className="fixed top-0 w-full z-40 h-16 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
                <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                                W
                            </div>
                            <span className="text-lg font-bold text-white hidden sm:inline">
                                WTREBOL <span className="font-light text-sky-500">INNOVACIÓN</span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-gray-400">Hola,</p>
                            <p className="text-sm font-semibold text-white">{customer.name.split(' ')[0]}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-lg transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Salir</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="pt-16 flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900/50 border-r border-white/10 hidden md:block">
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                                            ? 'bg-gradient-to-r from-sky-500/20 to-emerald-500/20 text-white border border-sky-500/30'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Customer Info in Sidebar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Cuenta de cliente</p>
                            <p className="text-sm font-semibold text-white truncate">{customer.name}</p>
                            <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                        </div>
                    </div>
                </aside>

                {/* Mobile Menu */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40">
                    <nav className="flex justify-around p-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${item.active
                                            ? 'text-sky-500'
                                            : 'text-gray-400'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-4 md:p-8 mb-20 md:mb-0">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
