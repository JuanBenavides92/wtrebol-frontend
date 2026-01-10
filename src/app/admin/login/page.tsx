import type { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
    title: 'Administración - WTREBOL',
    description: 'Panel de administración WTREBOL',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">W</span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
                        <p className="text-gray-400">Ingresa tus credenciales para continuar</p>
                    </div>

                    {/* Login Form */}
                    <LoginForm />

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} WTREBOL. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
