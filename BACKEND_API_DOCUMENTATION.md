# 📚 WTREBOL Backend API - Sistema de Citas

## 🔗 Endpoints Disponibles

### **Autenticación** (`/api/auth`)
- `POST /login` - Iniciar sesión
- `POST /logout` - Cerrar sesión
- `GET /me` - Obtener usuario actual

### **Contenido** (`/api/content`)
- `GET /slide` - Obtener slides
- `GET /product` - Obtener productos
- `GET /service` - Obtener servicios
- `GET /setting` - Obtener configuración
- `GET /item/:id` - Obtener item por ID
- `POST /` - Crear contenido
- `PUT /:id` - Actualizar contenido
- `DELETE /:id` - Eliminar contenido

### **Upload** (`/api/upload`)
- `POST /` - Subir archivo a S3
- `DELETE /` - Eliminar archivo de S3

---

## 🆕 **SISTEMA DE CITAS**

### **Citas Públicas** (`/api/public`) - Sin autenticación

#### **GET /api/public/appointment-types**
Obtiene los tipos de servicios disponibles para agendar.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "maintenance",
      "duration": 90,
      "color": "#0EA5E9",
      "price": null
    },
    {
      "type": "installation",
      "duration": 240,
      "color": "#8B5CF6",
      "price": null
    }
  ]
}
```

---

#### **GET /api/public/available-slots**
Obtiene los horarios disponibles para una fecha y tipo de servicio.

**Query Parameters:**
- `date` (required): Fecha en formato YYYY-MM-DD
- `serviceType` (required): Tipo de servicio (maintenance, installation, repair, etc.)

**Example:**
```
GET /api/public/available-slots?date=2026-01-15&serviceType=maintenance
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "start": "08:00", "end": "09:30" },
    { "start": "09:45", "end": "11:15" },
    { "start": "11:30", "end": "13:00" },
    { "start": "14:00", "end": "15:30" }
  ]
}
```

---

#### **POST /api/public/appointments**
Crea una nueva cita desde la página pública.

**Request Body:**
```json
{
  "type": "maintenance",
  "customer": {
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "phone": "+573001234567",
    "address": "Calle 123 #45-67, Bogotá",
    "notes": "Preferiblemente en la mañana"
  },
  "scheduledDate": "2026-01-15",
  "startTime": "09:00",
  "endTime": "10:30",
  "duration": 90,
  "serviceDetails": {
    "equipmentType": "Split",
    "brand": "LG",
    "model": "Inverter 12000 BTU",
    "issue": "No enfría correctamente"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cita agendada exitosamente. Recibirás un email de confirmación pronto.",
  "data": {
    "_id": "65abc123...",
    "type": "maintenance",
    "status": "pending",
    "customer": { ... },
    "scheduledDate": "2026-01-15T00:00:00.000Z",
    "startTime": "09:00",
    "endTime": "10:30",
    "createdBy": "customer",
    "notifications": {
      "emailSent": true,
      "whatsappSent": false,
      "reminderSent": false
    }
  }
}
```

---

### **Citas Admin** (`/api/appointments`) - Requiere autenticación

#### **GET /api/appointments**
Obtiene todas las citas con filtros opcionales.

**Query Parameters:**
- `date`: Fecha específica (YYYY-MM-DD)
- `startDate` & `endDate`: Rango de fechas
- `status`: Estado (pending, confirmed, in-progress, completed, cancelled, no-show)
- `type`: Tipo de servicio
- `technician`: ID del técnico
- `customer`: Email o teléfono del cliente

**Examples:**
```
GET /api/appointments?status=pending
GET /api/appointments?date=2026-01-15
GET /api/appointments?startDate=2026-01-10&endDate=2026-01-20
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "65abc123...",
      "type": "maintenance",
      "status": "confirmed",
      "customer": {
        "name": "Juan Pérez",
        "email": "juan@email.com",
        "phone": "+573001234567",
        "address": "Calle 123 #45-67"
      },
      "scheduledDate": "2026-01-15T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "10:30",
      "duration": 90,
      "technician": {
        "id": "65xyz789...",
        "name": "Carlos Rodríguez"
      },
      "createdAt": "2026-01-10T15:30:00.000Z"
    }
  ]
}
```

---

#### **GET /api/appointments/:id**
Obtiene una cita específica por ID.

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### **POST /api/appointments**
Crea una nueva cita desde el dashboard admin.

**Request Body:** (igual que POST /api/public/appointments)

---

#### **PUT /api/appointments/:id**
Actualiza una cita existente.

**Request Body:**
```json
{
  "status": "confirmed",
  "technician": {
    "id": "65xyz789...",
    "name": "Carlos Rodríguez"
  }
}
```

---

#### **DELETE /api/appointments/:id**
Elimina una cita.

**Response:**
```json
{
  "success": true,
  "message": "Cita eliminada exitosamente"
}
```

---

### **Configuración** (`/api/appointment-settings`) - Requiere autenticación

#### **GET /api/appointment-settings**
Obtiene la configuración del sistema de citas.

**Response:**
```json
{
  "success": true,
  "data": {
    "businessHours": {
      "monday": { "start": "08:00", "end": "20:00", "enabled": true },
      "tuesday": { "start": "08:00", "end": "20:00", "enabled": true },
      ...
    },
    "appointmentTypes": {
      "maintenance": { "duration": 90, "enabled": true, "color": "#0EA5E9" },
      "installation": { "duration": 240, "enabled": true, "color": "#8B5CF6" },
      ...
    },
    "slotInterval": 30,
    "bufferTime": 15,
    "maxAppointmentsPerDay": 20,
    "blackoutDates": [],
    "notifications": {
      "emailEnabled": true,
      "adminEmail": "admin@wtrebol.com",
      "reminderHoursBefore": 24
    }
  }
}
```

---

#### **PUT /api/appointment-settings**
Actualiza la configuración.

**Request Body:**
```json
{
  "businessHours": {
    "monday": { "start": "09:00", "end": "18:00", "enabled": true }
  },
  "slotInterval": 60
}
```

---

#### **POST /api/appointment-settings/blackout-date**
Agrega un día bloqueado.

**Request Body:**
```json
{
  "date": "2026-12-25"
}
```

---

#### **DELETE /api/appointment-settings/blackout-date/:date**
Elimina un día bloqueado.

---

### **Técnicos** (`/api/technicians`) - Requiere autenticación

#### **GET /api/technicians**
Obtiene todos los técnicos.

**Query Parameters:**
- `active`: true/false (filtrar solo activos)

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65xyz789...",
      "name": "Carlos Rodríguez",
      "email": "carlos@wtrebol.com",
      "phone": "+573009876543",
      "specialties": ["maintenance", "repair", "installation"],
      "isActive": true,
      "availability": {
        "monday": { "start": "08:00", "end": "17:00", "available": true },
        ...
      },
      "stats": {
        "totalAppointments": 45,
        "completedAppointments": 42,
        "cancelledAppointments": 3
      }
    }
  ]
}
```

---

#### **POST /api/technicians**
Crea un nuevo técnico.

**Request Body:**
```json
{
  "name": "Carlos Rodríguez",
  "email": "carlos@wtrebol.com",
  "phone": "+573009876543",
  "specialties": ["maintenance", "repair"],
  "isActive": true
}
```

---

#### **PUT /api/technicians/:id**
Actualiza un técnico.

---

#### **DELETE /api/technicians/:id**
Elimina un técnico.

---

#### **GET /api/technicians/:id/appointments**
Obtiene las citas asignadas a un técnico.

---

## 📧 Sistema de Notificaciones

### **Emails Automáticos**

#### **Al crear una cita:**
1. **Email al Admin** (`ADMIN_EMAIL`)
   - Asunto: "🔔 Nueva Cita: [Cliente] - [Servicio]"
   - Contenido:
     - Datos del cliente
     - Detalles de la cita
     - Link a WhatsApp del cliente

2. **Email al Cliente**
   - Asunto: "Confirmación de Cita - [Servicio]"
   - Contenido:
     - Confirmación de la cita
     - Fecha, hora, dirección
     - Información de contacto

### **Configuración de Email**

Agregar al `.env`:
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicación
ADMIN_EMAIL=admin@wtrebol.com
```

---

## 🗂️ Modelos de Base de Datos

### **Appointment**
```typescript
{
  type: 'maintenance' | 'installation' | 'repair' | 'quotation' | 'emergency' | 'deep-clean' | 'gas-refill',
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show',
  customer: {
    name: string,
    email: string,
    phone: string,
    address: string,
    notes?: string
  },
  scheduledDate: Date,
  startTime: string,
  endTime: string,
  duration: number,
  technician?: {
    id: ObjectId,
    name: string
  },
  serviceDetails?: {
    equipmentType?: string,
    brand?: string,
    model?: string,
    issue?: string,
    estimatedCost?: number
  },
  notifications: {
    emailSent: boolean,
    whatsappSent: boolean,
    reminderSent: boolean
  },
  createdBy: 'customer' | 'admin'
}
```

### **AppointmentSettings**
```typescript
{
  businessHours: {
    [day]: { start: string, end: string, enabled: boolean }
  },
  appointmentTypes: {
    [type]: { duration: number, enabled: boolean, color: string, price?: number }
  },
  slotInterval: number,
  bufferTime: number,
  maxAppointmentsPerDay: number,
  blackoutDates: Date[],
  notifications: {
    emailEnabled: boolean,
    adminEmail: string,
    reminderHoursBefore: number,
    emailTemplates: { ... }
  }
}
```

### **Technician**
```typescript
{
  name: string,
  email: string,
  phone: string,
  specialties: string[],
  isActive: boolean,
  availability: {
    [day]: { start: string, end: string, available: boolean }
  },
  blockedDates: Date[],
  stats: {
    totalAppointments: number,
    completedAppointments: number,
    cancelledAppointments: number,
    averageRating?: number
  }
}
```

---

## 🚀 Inicialización Automática

Al iniciar el servidor, se crea automáticamente la configuración por defecto si no existe:

- **Horarios:** 8 AM - 8 PM (todos los días)
- **7 tipos de servicios** habilitados
- **Slots:** 30 minutos
- **Buffer:** 15 minutos
- **Max citas/día:** 20

---

## 📝 Tipos de Servicios

| Tipo | Nombre | Duración | Color |
|------|--------|----------|-------|
| `maintenance` | Mantenimiento | 90 min | #0EA5E9 |
| `installation` | Instalación | 240 min | #8B5CF6 |
| `repair` | Reparación | 120 min | #F59E0B |
| `quotation` | Cotización | 45 min | #10B981 |
| `emergency` | Emergencia | 90 min | #EF4444 |
| `deep-clean` | Limpieza Profunda | 150 min | #06B6D4 |
| `gas-refill` | Recarga de Gas | 60 min | #EC4899 |

---

**Última actualización:** 2026-01-10  
**Versión:** 2.0 - Sistema de Citas Integrado
