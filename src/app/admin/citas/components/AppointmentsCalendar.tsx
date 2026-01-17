'use client';import API_CONFIG from '@/lib/config';

import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import TimeBlockModal, { TimeBlockData } from './TimeBlockModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import ConfirmModal from './ConfirmModal';
import SuccessToast from './SuccessModal';
import ErrorModal from './ErrorModal';
import '../calendar.css';
import './modals.css';

interface Appointment {
    _id: string;
    type: string;
    status: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    scheduledDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    technician?: {
        id: string;
        name: string;
    };
}

interface TimeBlock {
    _id: string;
    title: string;
    description?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    blockType: string;
    notes?: string;
    color: string;
}

const statusColors: Record<string, string> = {
    pending: '#FEF3C7',
    confirmed: '#DBEAFE',
    'in-progress': '#E9D5FF',
    completed: '#D1FAE5',
    cancelled: '#FEE2E2',
    'no-show': '#F3F4F6'
};

const statusBorderColors: Record<string, string> = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    'in-progress': '#A855F7',
    completed: '#10B981',
    cancelled: '#EF4444',
    'no-show': '#6B7280'
};

const typeLabels: Record<string, string> = {
    maintenance: 'Mantenimiento',
    installation: 'Instalación',
    repair: 'Reparación',
    quotation: 'Cotización',
    emergency: 'Emergencia',
    'deep-clean': 'Limpieza Profunda',
    'gas-refill': 'Recarga de Gas'
};

export default function AppointmentsCalendar() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const calendarRef = useRef<any>(null);

    // Estado para modal de detalles de cita
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    // Estados para modales de confirmación y mensajes
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type?: 'info' | 'warning' | 'danger';
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { }, type: 'info' });

    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean;
        message: string;
    }>({ isOpen: false, message: '' });

    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean;
        message: string;
    }>({ isOpen: false, message: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([loadAppointments(), loadTimeBlocks()]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadAppointments = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.APPOINTMENTS), {
                credentials: 'include'
            });

            console.log('Appointments response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Appointments result:', result);
                if (result.success && Array.isArray(result.data)) {
                    setAppointments(result.data);
                    console.log('Loaded appointments:', result.data.length);
                }
            } else {
                console.error('Failed to load appointments:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    };

    const loadTimeBlocks = async () => {
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.TIME_BLOCKS), {
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setTimeBlocks(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading time blocks:', error);
        }
    };

    // Convertir citas a eventos de FullCalendar
    const appointmentEvents = appointments.map((apt) => {
        // Extraer fecha directamente del string ISO para evitar problemas de zona horaria
        const dateStr = apt.scheduledDate.split('T')[0]; // YYYY-MM-DD

        return {
            id: `apt-${apt._id}`,
            title: `${apt.customer.name} - ${typeLabels[apt.type]}`,
            start: `${dateStr}T${apt.startTime}:00`,
            end: `${dateStr}T${apt.endTime}:00`,
            backgroundColor: statusColors[apt.status],
            borderColor: statusBorderColors[apt.status],
            textColor: '#1F2937',
            extendedProps: {
                type: 'appointment',
                appointment: apt
            }
        };
    });

    // Convertir bloques a eventos de FullCalendar
    const blockEvents = timeBlocks.map((block) => {
        // Extraer fecha directamente del string ISO para evitar problemas de zona horaria
        const dateStr = block.scheduledDate.split('T')[0]; // YYYY-MM-DD

        return {
            id: `block-${block._id}`,
            title: `🔒 ${block.title}`,
            start: `${dateStr}T${block.startTime}:00`,
            end: `${dateStr}T${block.endTime}:00`,
            backgroundColor: block.color + '40', // 40 = 25% opacity
            borderColor: block.color,
            textColor: '#1F2937',
            extendedProps: {
                type: 'time-block',
                timeBlock: block
            }
        };
    });

    const allEvents = [...appointmentEvents, ...blockEvents];

    const handleEventClick = (info: any) => {
        const eventType = info.event.extendedProps.type;

        if (eventType === 'appointment') {
            const apt = info.event.extendedProps.appointment;
            setSelectedAppointment(apt);
            setIsAppointmentModalOpen(true);
        } else if (eventType === 'time-block') {
            const block = info.event.extendedProps.timeBlock;
            const confirmDelete = confirm(`
🔒 Bloqueo de Horario

Título: ${block.title}
Tipo: ${block.blockType}
Hora: ${block.startTime} - ${block.endTime}
${block.description ? `\nDescripción: ${block.description}` : ''}

¿Deseas eliminar este bloqueo?
            `);

            if (confirmDelete) {
                handleDeleteBlock(block._id);
            }
        }
    };

    const handleDateClick = (info: any) => {
        // Extraer hora del click si está disponible (en vista de semana/día)
        let startTime = '09:00';
        let endTime = '10:00';

        if (info.date) {
            const hours = String(info.date.getHours()).padStart(2, '0');
            const minutes = String(info.date.getMinutes()).padStart(2, '0');
            startTime = `${hours}:${minutes}`;

            // Hora de fin: 1 hora después
            const endDate = new Date(info.date);
            endDate.setHours(endDate.getHours() + 1);
            const endHours = String(endDate.getHours()).padStart(2, '0');
            const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
            endTime = `${endHours}:${endMinutes}`;
        }

        setSelectedDate(info.dateStr);
        setSelectedTime({ start: startTime, end: endTime });
        setIsBlockModalOpen(true);
    };

    const handleCreateBlock = async (blockData: TimeBlockData) => {
        try {
            // TODO: Obtener el ID del usuario actual del contexto de autenticación
            const userId = '507f1f77bcf86cd799439011'; // Placeholder

            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.TIME_BLOCKS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...blockData,
                    createdBy: userId
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('✅ Bloqueo creado exitosamente');
                setIsBlockModalOpen(false);
                await loadTimeBlocks();
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error creating time block:', error);
            alert('❌ Error al crear el bloqueo');
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TIME_BLOCKS}/${blockId}`), {
                method: 'DELETE',
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('✅ Bloqueo eliminado exitosamente');
                await loadTimeBlocks();
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error deleting time block:', error);
            alert('❌ Error al eliminar el bloqueo');
        }
    };

    // Handler para actualizar cita desde el modal de detalles
    const handleUpdateAppointment = async (appointmentId: string, updates: any) => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccessModal({
                    isOpen: true,
                    message: 'Cita actualizada exitosamente'
                });
                await loadAppointments();
            } else {
                setErrorModal({
                    isOpen: true,
                    message: result.message || 'Error al actualizar la cita'
                });
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            setErrorModal({
                isOpen: true,
                message: 'Error al actualizar la cita'
            });
        }
    };

    // Handler para eliminar cita desde el modal de detalles
    const handleDeleteAppointment = async (appointmentId: string) => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${appointmentId}`), {
                method: 'DELETE',
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccessModal({
                    isOpen: true,
                    message: 'Cita eliminada exitosamente'
                });
                await loadAppointments();
            } else {
                setErrorModal({
                    isOpen: true,
                    message: result.message || 'Error al eliminar la cita'
                });
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            setErrorModal({
                isOpen: true,
                message: 'Error al eliminar la cita'
            });
        }
    };

    // Handler para cuando se mueve un evento (drag & drop)
    const handleEventDrop = async (info: any) => {
        const eventType = info.event.extendedProps.type;
        const newStart = info.event.start;
        const newEnd = info.event.end;

        // Extraer fecha usando toISOString para evitar problemas de zona horaria
        const startISO = newStart.toISOString();
        const newDate = startISO.split('T')[0]; // YYYY-MM-DD

        const startHours = String(newStart.getHours()).padStart(2, '0');
        const startMinutes = String(newStart.getMinutes()).padStart(2, '0');
        const newStartTime = `${startHours}:${startMinutes}`;

        const endHours = String(newEnd.getHours()).padStart(2, '0');
        const endMinutes = String(newEnd.getMinutes()).padStart(2, '0');
        const newEndTime = `${endHours}:${endMinutes}`;

        if (eventType === 'appointment') {
            const apt = info.event.extendedProps.appointment;
            const confirmMove = confirm(`¿Mover cita de ${apt.customer.name} a ${newDate} ${newStartTime}-${newEndTime}?`);

            if (!confirmMove) {
                info.revert();
                return;
            }

            try {
                const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${apt._id}`), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        scheduledDate: newDate,
                        startTime: newStartTime,
                        endTime: newEndTime
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('✅ Cita movida exitosamente');
                    await loadAppointments();
                } else {
                    alert(`❌ Error: ${result.message}`);
                    info.revert();
                }
            } catch (error) {
                console.error('Error moving appointment:', error);
                alert('❌ Error al mover la cita');
                info.revert();
            }
        } else if (eventType === 'time-block') {
            const block = info.event.extendedProps.timeBlock;
            const confirmMove = confirm(`¿Mover bloqueo "${block.title}" a ${newDate} ${newStartTime}-${newEndTime}?`);

            if (!confirmMove) {
                info.revert();
                return;
            }

            try {
                const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TIME_BLOCKS}/${block._id}`), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        scheduledDate: newDate,
                        startTime: newStartTime,
                        endTime: newEndTime
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('✅ Bloqueo movido exitosamente');
                    await loadTimeBlocks();
                } else {
                    alert(`❌ Error: ${result.message}`);
                    info.revert();
                }
            } catch (error) {
                console.error('Error moving block:', error);
                alert('❌ Error al mover el bloqueo');
                info.revert();
            }
        }
    };

    // Handler para cuando se redimensiona un evento
    const handleEventResize = async (info: any) => {
        const eventType = info.event.extendedProps.type;
        const newEnd = info.event.end;

        const endHours = String(newEnd.getHours()).padStart(2, '0');
        const endMinutes = String(newEnd.getMinutes()).padStart(2, '0');
        const newEndTime = `${endHours}:${endMinutes}`;

        if (eventType === 'appointment') {
            const apt = info.event.extendedProps.appointment;

            try {
                const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${apt._id}`), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        endTime: newEndTime
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('✅ Duración actualizada');
                    await loadAppointments();
                } else {
                    alert(`❌ Error: ${result.message}`);
                    info.revert();
                }
            } catch (error) {
                console.error('Error resizing appointment:', error);
                alert('❌ Error al cambiar duración');
                info.revert();
            }
        } else if (eventType === 'time-block') {
            const block = info.event.extendedProps.timeBlock;

            try {
                const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.TIME_BLOCKS}/${block._id}`), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        endTime: newEndTime
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('✅ Duración actualizada');
                    await loadTimeBlocks();
                } else {
                    alert(`❌ Error: ${result.message}`);
                    info.revert();
                }
            } catch (error) {
                console.error('Error resizing block:', error);
                alert('❌ Error al cambiar duración');
                info.revert();
            }
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                <p className="mt-4 text-gray-600">Cargando calendario...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Leyenda de colores */}
            <div className="mb-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: statusColors.pending, border: `2px solid ${statusBorderColors.pending}` }}></div>
                    <span className="text-gray-700">Pendiente</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: statusColors.confirmed, border: `2px solid ${statusBorderColors.confirmed}` }}></div>
                    <span className="text-gray-700">Confirmada</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: statusColors['in-progress'], border: `2px solid ${statusBorderColors['in-progress']}` }}></div>
                    <span className="text-gray-700">En Progreso</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: statusColors.completed, border: `2px solid ${statusBorderColors.completed}` }}></div>
                    <span className="text-gray-700">Completada</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: statusColors.cancelled, border: `2px solid ${statusBorderColors.cancelled}` }}></div>
                    <span className="text-gray-700">Cancelada</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B728040', border: `2px solid #6B7280` }}></div>
                    <span className="text-gray-700">🔒 Bloqueado</span>
                </div>
            </div>

            {/* Calendario */}
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                }}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    list: 'Lista'
                }}
                events={allEvents}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                height="auto"
                slotMinTime="07:00:00"
                slotMaxTime="21:00:00"
                allDaySlot={false}
                nowIndicator={true}
                navLinks={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                }}
            />

            {/* Nota informativa */}
            <div className="mt-4 bg-sky-50 border border-sky-200 rounded-lg p-4">
                <p className="text-sm text-sky-900">
                    <strong>💡 Tip:</strong> Arrastra citas para moverlas, estira desde los bordes para cambiar duración,
                    o haz click en cualquier fecha para bloquear un horario. Los bloques aparecen con 🔒 y puedes eliminarlos haciendo click sobre ellos.
                </p>
            </div>

            {/* Modal de Bloqueo */}
            <TimeBlockModal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                onSubmit={handleCreateBlock}
                initialDate={selectedDate}
                initialStartTime={selectedTime.start}
                initialEndTime={selectedTime.end}
            />

            {/* Modal de Detalles de Cita */}
            <AppointmentDetailsModal
                isOpen={isAppointmentModalOpen}
                appointment={selectedAppointment}
                onClose={() => {
                    setIsAppointmentModalOpen(false);
                    setSelectedAppointment(null);
                }}
                onUpdate={handleUpdateAppointment}
                onDelete={handleDeleteAppointment}
            />

            {/* Modales de Confirmación y Notificaciones */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />

            <SuccessToast
                isOpen={successModal.isOpen}
                message={successModal.message}
                onClose={() => setSuccessModal({ isOpen: false, message: '' })}
            />

            <ErrorModal
                isOpen={errorModal.isOpen}
                message={errorModal.message}
                onClose={() => setErrorModal({ isOpen: false, message: '' })}
            />
        </div>
    );
}

