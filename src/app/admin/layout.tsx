'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    // Don't show sidebar/header on login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-72">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-slate-900/30">
                    {children}
                </main>
            </div>
        </div>
    );
}

