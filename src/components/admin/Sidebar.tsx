'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Image as ImageIcon,
    ShoppingBag,
    Wrench,
    Settings,
    Film,
    Calendar,
    Users
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Slides', href: '/admin/slides', icon: Film },
    { name: 'Productos', href: '/admin/productos', icon: ShoppingBag },
    { name: 'Servicios', href: '/admin/servicios', icon: Wrench },
    { name: 'Citas', href: '/admin/citas', icon: Calendar },
    { name: 'Técnicos', href: '/admin/tecnicos', icon: Users },
    { name: 'Galería', href: '/admin/media', icon: ImageIcon },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-800 border-r border-white/10 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">W</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">WTREBOL</h1>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-sky-500 text-white'
                                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                                }
                            `}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <p className="text-xs text-gray-500 text-center">
                    © {new Date().getFullYear()} WTREBOL
                </p>
            </div>
        </aside>
    );
}
