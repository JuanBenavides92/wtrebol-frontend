'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import Tabs from './components/Tabs';
import AppointmentsTable from './components/AppointmentsTable';
import AppointmentsCalendar from './components/AppointmentsCalendar';

export default function AppointmentsPage() {
    const router = useRouter();

    const tabs = [
        { id: 'list', label: 'Gestión de Citas', icon: '📋' },
        { id: 'calendar', label: 'Calendario', icon: '📅' }
    ];

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Gestión de Citas</h1>
                    <p className="text-slate-400">Administra y organiza todas las citas de servicio</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/admin/citas/nueva')}
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-sky-500/50 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Cita
                </motion.button>
            </motion.div>

            {/* Tabs */}
            <Tabs tabs={tabs} defaultTab="list">
                {(activeTab) => (
                    <>
                        {activeTab === 'list' && <AppointmentsTable />}
                        {activeTab === 'calendar' && <AppointmentsCalendar />}
                    </>
                )}
            </Tabs>
        </div>
    );
}

