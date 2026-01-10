# 🚀 Plan de Implementación - Sistema de Citas WTREBOL

## 📋 Resumen Ejecutivo

**Objetivo:** Sistema completo de gestión de citas para servicios HVAC  
**Enfoque:** Backend primero, luego Frontend  
**Notificaciones:** WhatsApp + Email  
**Horario Inicial:** 8 AM - 8 PM (todos los días, configurable)

---

## 🏗️ FASE 1: BACKEND - Modelos y Base de Datos

### **1.1 Modelo: Appointment (Cita)**

```typescript
// wtrebol-backend/src/models/Appointment.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
    // Tipo de Servicio
    type: 'maintenance' | 'installation' | 'repair' | 'quotation' | 'emergency' | 'deep-clean' | 'gas-refill';
    
    // Estado
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
    
    // Cliente
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        notes?: string;
    };
    
    // Fecha y Hora
    scheduledDate: Date;
    startTime: string;        // "09:00"
    endTime: string;          // "10:30"
    duration: number;         // minutos
    
    // Técnico Asignado (opcional)
    technician?: {
        id: mongoose.Types.ObjectId;
        name: string;
    };
    
    // Detalles del Servicio
    serviceDetails?: {
        equipmentType?: string;
        brand?: string;
        model?: string;
        issue?: string;
        estimatedCost?: number;
    };
    
    // Notificaciones
    notifications: {
        emailSent: boolean;
        whatsappSent: boolean;
        reminderSent: boolean;
    };
    
    // Metadata
    createdBy: 'customer' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}
```

---

### **1.2 Modelo: AppointmentSettings (Configuración)**

```typescript
// wtrebol-backend/src/models/AppointmentSettings.ts

export interface IAppointmentSettings extends Document {
    // Horarios de Operación
    businessHours: {
        monday: { start: string; end: string; enabled: boolean };
        tuesday: { start: string; end: string; enabled: boolean };
        wednesday: { start: string; end: string; enabled: boolean };
        thursday: { start: string; end: string; enabled: boolean };
        friday: { start: string; end: string; enabled: boolean };
        saturday: { start: string; end: string; enabled: boolean };
        sunday: { start: string; end: string; enabled: boolean };
    };
    
    // Tipos de Citas (duración en minutos)
    appointmentTypes: {
        maintenance: { duration: number; enabled: boolean; color: string; price?: number };
        installation: { duration: number; enabled: boolean; color: string; price?: number };
        repair: { duration: number; enabled: boolean; color: string; price?: number };
        quotation: { duration: number; enabled: boolean; color: string; price?: number };
        emergency: { duration: number; enabled: boolean; color: string; price?: number };
        deepClean: { duration: number; enabled: boolean; color: string; price?: number };
        gasRefill: { duration: number; enabled: boolean; color: string; price?: number };
    };
    
    // Configuración de Slots
    slotInterval: number;           // 15, 30, 60 minutos
    bufferTime: number;             // tiempo entre citas (minutos)
    maxAppointmentsPerDay: number;
    
    // Días Bloqueados
    blackoutDates: Date[];
    
    // Notificaciones
    notifications: {
        emailEnabled: boolean;
        whatsappEnabled: boolean;
        reminderHoursBefore: number;
        
        // Plantillas
        emailTemplates: {
            confirmation: string;
            reminder: string;
            cancellation: string;
        };
        whatsappTemplates: {
            confirmation: string;
            reminder: string;
            cancellation: string;
        };
    };
    
    // WhatsApp Config
    whatsapp: {
        businessNumber: string;
        apiEnabled: boolean;
    };
}
```

---

### **1.3 Modelo: Technician (Técnico)**

```typescript
// wtrebol-backend/src/models/Technician.ts

export interface ITechnician extends Document {
    name: string;
    email: string;
    phone: string;
    
    // Especialidades
    specialties: ('maintenance' | 'installation' | 'repair' | 'quotation' | 'emergency' | 'deep-clean' | 'gas-refill')[];
    
    // Estado
    isActive: boolean;
    
    // Disponibilidad Semanal
    availability: {
        monday: { start: string; end: string; available: boolean };
        tuesday: { start: string; end: string; available: boolean };
        wednesday: { start: string; end: string; available: boolean };
        thursday: { start: string; end: string; available: boolean };
        friday: { start: string; end: string; available: boolean };
        saturday: { start: string; end: string; available: boolean };
        sunday: { start: string; end: string; available: boolean };
    };
    
    // Días Bloqueados Específicos
    blockedDates: Date[];
    
    // Estadísticas
    stats: {
        totalAppointments: number;
        completedAppointments: number;
        cancelledAppointments: number;
        averageRating?: number;
    };
    
    createdAt: Date;
    updatedAt: Date;
}
```

---

## 🔌 FASE 2: BACKEND - API Endpoints

### **2.1 Appointments Routes**

```typescript
// GET    /api/appointments              - Listar todas las citas (con filtros)
// GET    /api/appointments/:id          - Obtener cita por ID
// POST   /api/appointments              - Crear nueva cita
// PUT    /api/appointments/:id          - Actualizar cita
// DELETE /api/appointments/:id          - Eliminar cita
// GET    /api/appointments/available-slots  - Obtener slots disponibles
// POST   /api/appointments/:id/confirm  - Confirmar cita
// POST   /api/appointments/:id/cancel   - Cancelar cita
// POST   /api/appointments/:id/complete - Marcar como completada
```

**Filtros para GET /api/appointments:**
- `?date=2026-01-10` - Por fecha específica
- `?startDate=2026-01-10&endDate=2026-01-15` - Rango de fechas
- `?status=pending` - Por estado
- `?type=maintenance` - Por tipo
- `?technician=123` - Por técnico
- `?customer=juan@email.com` - Por cliente

---

### **2.2 Appointment Settings Routes**

```typescript
// GET    /api/appointment-settings      - Obtener configuración
// PUT    /api/appointment-settings      - Actualizar configuración
// POST   /api/appointment-settings/blackout-date  - Agregar día bloqueado
// DELETE /api/appointment-settings/blackout-date/:date  - Eliminar día bloqueado
```

---

### **2.3 Technicians Routes**

```typescript
// GET    /api/technicians               - Listar técnicos
// GET    /api/technicians/:id           - Obtener técnico por ID
// POST   /api/technicians               - Crear técnico
// PUT    /api/technicians/:id           - Actualizar técnico
// DELETE /api/technicians/:id           - Eliminar técnico
// GET    /api/technicians/:id/appointments  - Citas del técnico
// GET    /api/technicians/available     - Técnicos disponibles para fecha/hora
```

---

### **2.4 Public Routes (Sin autenticación)**

```typescript
// GET    /api/public/available-slots    - Slots disponibles (público)
// POST   /api/public/appointments       - Crear cita (público)
// GET    /api/public/appointment-types  - Tipos de citas disponibles
```

---

## 📧 FASE 3: BACKEND - Sistema de Notificaciones

### **3.1 WhatsApp Integration**

**Opción Inicial (Gratis):**
```typescript
// Generar link de WhatsApp con mensaje pre-llenado
function generateWhatsAppLink(appointment: IAppointment): string {
    const phone = '573001234567'; // Número de WTREBOL
    const message = encodeURIComponent(
        `Hola! Confirmación de cita:\n\n` +
        `📅 Fecha: ${formatDate(appointment.scheduledDate)}\n` +
        `⏰ Hora: ${appointment.startTime}\n` +
        `🔧 Servicio: ${appointment.type}\n` +
        `👤 Cliente: ${appointment.customer.name}\n\n` +
        `¿Confirmas tu asistencia?`
    );
    
    return `https://wa.me/${phone}?text=${message}`;
}
```

**Opción Futura (Twilio - Automático):**
```typescript
import twilio from 'twilio';

async function sendWhatsAppNotification(appointment: IAppointment) {
    const client = twilio(accountSid, authToken);
    
    await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${appointment.customer.phone}`,
        body: `Confirmación de cita...\n...`
    });
}
```

---

### **3.2 Email Notifications**

```typescript
// Usar Nodemailer (ya configurado en backend)
async function sendAppointmentEmail(appointment: IAppointment, type: 'confirmation' | 'reminder' | 'cancellation') {
    const templates = {
        confirmation: `
            <h1>¡Cita Confirmada!</h1>
            <p>Hola ${appointment.customer.name},</p>
            <p>Tu cita ha sido confirmada:</p>
            <ul>
                <li>Servicio: ${appointment.type}</li>
                <li>Fecha: ${formatDate(appointment.scheduledDate)}</li>
                <li>Hora: ${appointment.startTime}</li>
            </ul>
        `,
        // ... más plantillas
    };
    
    await sendEmail({
        to: appointment.customer.email,
        subject: 'Confirmación de Cita - WTREBOL',
        html: templates[type]
    });
}
```

---

## 🎯 FASE 4: BACKEND - Lógica de Negocio

### **4.1 Calcular Slots Disponibles**

```typescript
async function getAvailableSlots(date: Date, serviceType: string) {
    // 1. Obtener configuración
    const settings = await AppointmentSettings.findOne();
    const dayOfWeek = getDayOfWeek(date);
    const businessHours = settings.businessHours[dayOfWeek];
    
    // 2. Verificar si el día está habilitado
    if (!businessHours.enabled) return [];
    
    // 3. Verificar si es día bloqueado
    if (settings.blackoutDates.includes(date)) return [];
    
    // 4. Generar slots según intervalo
    const slots = generateTimeSlots(
        businessHours.start,
        businessHours.end,
        settings.slotInterval,
        settings.appointmentTypes[serviceType].duration
    );
    
    // 5. Obtener citas existentes del día
    const existingAppointments = await Appointment.find({
        scheduledDate: date,
        status: { $ne: 'cancelled' }
    });
    
    // 6. Filtrar slots ocupados
    const availableSlots = slots.filter(slot => 
        !isSlotOccupied(slot, existingAppointments)
    );
    
    return availableSlots;
}
```

---

### **4.2 Asignación Automática de Técnicos**

```typescript
async function assignTechnician(appointment: IAppointment) {
    // 1. Buscar técnicos con la especialidad
    const technicians = await Technician.find({
        isActive: true,
        specialties: appointment.type
    });
    
    // 2. Filtrar por disponibilidad
    const dayOfWeek = getDayOfWeek(appointment.scheduledDate);
    const availableTechs = technicians.filter(tech => {
        const availability = tech.availability[dayOfWeek];
        return availability.available &&
               isTimeInRange(appointment.startTime, availability.start, availability.end);
    });
    
    // 3. Verificar que no tengan otra cita a esa hora
    const freeTechs = [];
    for (const tech of availableTechs) {
        const hasConflict = await Appointment.findOne({
            'technician.id': tech._id,
            scheduledDate: appointment.scheduledDate,
            $or: [
                { startTime: { $lte: appointment.startTime }, endTime: { $gt: appointment.startTime } },
                { startTime: { $lt: appointment.endTime }, endTime: { $gte: appointment.endTime } }
            ]
        });
        
        if (!hasConflict) freeTechs.push(tech);
    }
    
    // 4. Seleccionar técnico con menos citas (balanceo de carga)
    if (freeTechs.length > 0) {
        const techWithLeastAppointments = freeTechs.sort((a, b) => 
            a.stats.totalAppointments - b.stats.totalAppointments
        )[0];
        
        return {
            id: techWithLeastAppointments._id,
            name: techWithLeastAppointments.name
        };
    }
    
    return null; // Sin técnicos disponibles
}
```

---

## 📱 FASE 5: FRONTEND - Dashboard Admin

### **5.1 Páginas a Crear**

```
/admin/citas                    - Vista principal (calendario)
/admin/citas/nueva              - Crear cita
/admin/citas/:id                - Editar cita
/admin/tecnicos                 - Lista de técnicos
/admin/tecnicos/nuevo           - Crear técnico
/admin/tecnicos/:id             - Editar técnico
/admin/citas/configuracion      - Configuración de horarios y tipos
/admin/citas/reportes           - Estadísticas y reportes
```

---

### **5.2 Componentes Clave**

```typescript
// CalendarView.tsx - Vista de calendario
// AppointmentCard.tsx - Tarjeta de cita
// AppointmentModal.tsx - Modal de detalles
// TechnicianSelector.tsx - Selector de técnico
// TimeSlotPicker.tsx - Selector de horario
// BusinessHoursConfig.tsx - Configuración de horarios
// AppointmentTypeConfig.tsx - Configuración de tipos
```

---

## 🌐 FASE 6: FRONTEND - Página Pública

### **6.1 Página `/calendario`**

**Componentes:**
```typescript
// BookingWizard.tsx - Wizard de 3 pasos
// ServiceSelector.tsx - Paso 1: Seleccionar servicio
// DateTimePicker.tsx - Paso 2: Fecha y hora
// CustomerForm.tsx - Paso 3: Datos del cliente
// BookingConfirmation.tsx - Confirmación
```

---

## 🔄 FASE 7: Integraciones

### **7.1 WhatsApp**

**Configuración Inicial (.env):**
```bash
# WhatsApp Business Number
WHATSAPP_BUSINESS_NUMBER=+573001234567

# Twilio (Opcional - Para futuro)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
```

**Implementación:**
```typescript
// Por ahora: Link directo
function sendWhatsAppLink(appointment: IAppointment) {
    const link = generateWhatsAppLink(appointment);
    // Enviar link por email o mostrar en confirmación
    return link;
}

// Futuro: Twilio automático
async function sendWhatsAppMessage(appointment: IAppointment) {
    if (process.env.TWILIO_ACCOUNT_SID) {
        await sendTwilioWhatsApp(appointment);
    } else {
        return generateWhatsAppLink(appointment);
    }
}
```

---

## 📊 FASE 8: Reportes y Estadísticas

### **8.1 Métricas a Mostrar**

```typescript
interface AppointmentStats {
    // Por Período
    totalAppointments: number;
    confirmedAppointments: number;
    pendingAppointments: number;
    cancelledAppointments: number;
    completedAppointments: number;
    noShowAppointments: number;
    
    // Por Tipo
    appointmentsByType: {
        maintenance: number;
        installation: number;
        repair: number;
        // ...
    };
    
    // Por Técnico
    appointmentsByTechnician: {
        technicianId: string;
        technicianName: string;
        count: number;
    }[];
    
    // Tasas
    confirmationRate: number;  // %
    completionRate: number;    // %
    noShowRate: number;        // %
    
    // Ingresos Estimados
    estimatedRevenue: number;
}
```

---

## 🗓️ CRONOGRAMA DE IMPLEMENTACIÓN

### **Semana 1: Backend Base**
- ✅ Día 1-2: Crear modelos (Appointment, Settings, Technician)
- ✅ Día 3-4: Crear controladores y rutas
- ✅ Día 5: Lógica de slots disponibles
- ✅ Día 6-7: Testing de API

### **Semana 2: Backend Avanzado**
- ✅ Día 1-2: Sistema de notificaciones (Email + WhatsApp link)
- ✅ Día 3-4: Asignación de técnicos
- ✅ Día 5-6: Validaciones y edge cases
- ✅ Día 7: Testing completo

### **Semana 3: Dashboard Admin**
- ✅ Día 1-2: Vista de calendario
- ✅ Día 3-4: CRUD de citas
- ✅ Día 5-6: Gestión de técnicos
- ✅ Día 7: Configuración de horarios

### **Semana 4: Página Pública + Pulido**
- ✅ Día 1-3: Página `/calendario` (booking público)
- ✅ Día 4-5: Reportes y estadísticas
- ✅ Día 6-7: Testing completo y ajustes

---

## 🎯 CONFIGURACIÓN INICIAL

### **Valores por Defecto:**

```typescript
const defaultSettings: IAppointmentSettings = {
    businessHours: {
        monday: { start: '08:00', end: '20:00', enabled: true },
        tuesday: { start: '08:00', end: '20:00', enabled: true },
        wednesday: { start: '08:00', end: '20:00', enabled: true },
        thursday: { start: '08:00', end: '20:00', enabled: true },
        friday: { start: '08:00', end: '20:00', enabled: true },
        saturday: { start: '08:00', end: '20:00', enabled: true },
        sunday: { start: '08:00', end: '20:00', enabled: true },
    },
    
    appointmentTypes: {
        maintenance: { duration: 90, enabled: true, color: '#0EA5E9' },
        installation: { duration: 240, enabled: true, color: '#8B5CF6' },
        repair: { duration: 120, enabled: true, color: '#F59E0B' },
        quotation: { duration: 45, enabled: true, color: '#10B981' },
        emergency: { duration: 90, enabled: true, color: '#EF4444' },
        deepClean: { duration: 150, enabled: true, color: '#06B6D4' },
        gasRefill: { duration: 60, enabled: true, color: '#EC4899' },
    },
    
    slotInterval: 30,
    bufferTime: 15,
    maxAppointmentsPerDay: 20,
    
    blackoutDates: [],
    
    notifications: {
        emailEnabled: true,
        whatsappEnabled: true,
        reminderHoursBefore: 24,
        emailTemplates: { /* ... */ },
        whatsappTemplates: { /* ... */ }
    },
    
    whatsapp: {
        businessNumber: '+573001234567',
        apiEnabled: false  // Cambiar a true cuando tengas Twilio
    }
};
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Backend:**
- [ ] Modelo Appointment
- [ ] Modelo AppointmentSettings
- [ ] Modelo Technician
- [ ] Controller de Appointments
- [ ] Controller de Settings
- [ ] Controller de Technicians
- [ ] Rutas públicas
- [ ] Rutas privadas (admin)
- [ ] Lógica de slots disponibles
- [ ] Asignación de técnicos
- [ ] Sistema de notificaciones Email
- [ ] Sistema de notificaciones WhatsApp (link)
- [ ] Validaciones
- [ ] Testing

### **Frontend Admin:**
- [ ] Vista de calendario
- [ ] Lista de citas
- [ ] Crear/Editar cita
- [ ] Gestión de técnicos
- [ ] Configuración de horarios
- [ ] Configuración de tipos de citas
- [ ] Reportes y estadísticas

### **Frontend Público:**
- [ ] Página `/calendario`
- [ ] Wizard de booking
- [ ] Confirmación de cita
- [ ] Email de confirmación

---

## 🚀 PRÓXIMO PASO

**¿Comenzamos con la Fase 1 (Backend - Modelos)?**

Puedo crear:
1. Los 3 modelos (Appointment, Settings, Technician)
2. Los controladores básicos
3. Las rutas de API

¿Apruebas para comenzar?

---

**Última actualización:** 2026-01-10  
**Estimación total:** 4 semanas de desarrollo
