'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown
} from 'lucide-react';

export default function AdminHeader() {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Left: Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar en el panel..."
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-medium text-white">{user?.name || user?.email}</p>
                            <p className="text-xs text-slate-400">{user?.role || 'Administrador'}</p>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="p-4 border-b border-white/10">
                                    <p className="text-sm font-bold text-white">{user?.name || user?.email}</p>
                                    <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group">
                                        <Settings className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Configuración</span>
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors group"
                                    >
                                        <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                                        <span className="text-sm text-slate-400 group-hover:text-red-400 transition-colors">Cerrar Sesión</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

