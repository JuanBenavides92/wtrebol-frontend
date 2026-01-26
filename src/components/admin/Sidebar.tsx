'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Image as ImageIcon,
    ShoppingBag,
    Wrench,
    Settings,
    Film,
    Calendar,
    Users,
    ChevronRight,
    LogOut,
    Bell,
    Award,
    HelpCircle,
    Package,
    UserCog,
    HardHat
} from 'lucide-react';

const navigation = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        badge: null,
        gradient: 'from-sky-400 to-blue-500'
    },
    {
        name: 'Slides',
        href: '/admin/slides',
        icon: Film,
        badge: null,
        gradient: 'from-purple-400 to-pink-500'
    },
    {
        name: 'Productos',
        href: '/admin/productos',
        icon: ShoppingBag,
        badge: null,
        gradient: 'from-emerald-400 to-teal-500'
    },
    {
        name: 'Pedidos',
        href: '/admin/pedidos',
        icon: Package,
        badge: null,
        gradient: 'from-blue-400 to-cyan-500'
    },
    {
        name: 'Clientes',
        href: '/admin/clientes',
        icon: Users,
        badge: null,
        gradient: 'from-violet-400 to-purple-500'
    },
    {
        name: 'Usuarios',
        href: '/admin/usuarios',
        icon: UserCog,
        badge: null,
        gradient: 'from-rose-400 to-pink-500'
    },
    {
        name: 'Servicios',
        href: '/admin/servicios',
        icon: Wrench,
        badge: null,
        gradient: 'from-orange-400 to-red-500'
    },
    {
        name: 'Ventajas',
        href: '/admin/ventajas',
        icon: Award,
        badge: null,
        gradient: 'from-yellow-400 to-amber-500'
    },
    {
        name: 'FAQs',
        href: '/admin/faqs',
        icon: HelpCircle,
        badge: null,
        gradient: 'from-indigo-400 to-purple-500'
    },
    {
        name: 'Citas',
        href: '/admin/citas',
        icon: Calendar,
        badge: 3,
        gradient: 'from-amber-400 to-orange-500'
    },
    {
        name: 'Técnicos',
        href: '/admin/tecnicos',
        icon: HardHat,
        badge: null,
        gradient: 'from-cyan-400 to-blue-500'
    },
    {
        name: 'Galería',
        href: '/admin/media',
        icon: ImageIcon,
        badge: null,
        gradient: 'from-pink-400 to-rose-500'
    },
    {
        name: 'Configuración',
        href: '/admin/configuracion',
        icon: Settings,
        badge: null,
        gradient: 'from-slate-400 to-slate-600'
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-white/10 flex flex-col z-50">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Decorative blur elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/50"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            <span className="text-2xl font-bold text-white">W</span>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold text-white">WTREBOL</h1>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        const isHovered = hoveredItem === item.name;

                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    onMouseEnter={() => setHoveredItem(item.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className="block relative group"
                                >
                                    <div className={`
                                        flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                                        ${isActive
                                            ? 'bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg'
                                            : 'hover:bg-white/5 border border-transparent'
                                        }
                                    `}>
                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-emerald-400 rounded-r-full"
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}

                                        {/* Icon with gradient background */}
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                                            ${isActive || isHovered
                                                ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                                                : 'bg-white/5'
                                            }
                                        `}>
                                            <Icon className={`
                                                h-5 w-5 transition-all duration-300
                                                ${isActive || isHovered ? 'text-white' : 'text-slate-400'}
                                            `} />
                                        </div>

                                        {/* Text */}
                                        <span className={`
                                            font-medium flex-1 transition-colors duration-300
                                            ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                                        `}>
                                            {item.name}
                                        </span>

                                        {/* Badge */}
                                        {item.badge && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full"
                                            >
                                                {item.badge}
                                            </motion.span>
                                        )}

                                        {/* Arrow indicator */}
                                        <ChevronRight className={`
                                            h-4 w-4 transition-all duration-300
                                            ${isActive
                                                ? 'text-white opacity-100 translate-x-0'
                                                : 'text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                                            }
                                        `} />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/10 space-y-2">
                    {/* Notifications */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center relative">
                            <Bell className="h-5 w-5 text-white" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
                        </div>
                        <span className="font-medium text-slate-400 group-hover:text-white transition-colors flex-1 text-left">
                            Notificaciones
                        </span>
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            2
                        </span>
                    </button>

                    {/* Logout */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-red-500 flex items-center justify-center transition-colors">
                            <LogOut className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-medium text-slate-400 group-hover:text-red-400 transition-colors flex-1 text-left">
                            Cerrar Sesión
                        </span>
                    </button>

                    {/* Copyright */}
                    <p className="text-xs text-slate-600 text-center pt-2">
                        © {new Date().getFullYear()} WTREBOL
                    </p>
                </div>
            </div>
        </aside>
    );
}

