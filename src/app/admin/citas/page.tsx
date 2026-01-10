'use client';

import { useRouter } from 'next/navigation';
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Citas</h1>
                <button
                    onClick={() => router.push('/admin/citas/nueva')}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    + Nueva Cita
                </button>
            </div>

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
