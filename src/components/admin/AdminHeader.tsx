'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function AdminHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-slate-800 border-b border-white/10 flex items-center justify-between px-6">
            <div>
                <h2 className="text-lg font-semibold text-white">Panel de Administración</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-700/50 rounded-lg">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">{user?.name || user?.email}</p>
                        <p className="text-xs text-gray-400">{user?.role || 'Administrador'}</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Salir</span>
                </button>
            </div>
        </header>
    );
}
