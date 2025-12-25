# 📋 Configuración - Ejemplo Completo

Archivo de ejemplo de todas las configuraciones disponibles del sistema.

## 🔧 Variables de Entorno (.env)

```env
# ============================================
# CONFIGURACIÓN DEL BOT TELEGRAM
# ============================================

# Token del bot (REQUERIDO)
# Obtener de https://t.me/botfather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjkLMNOpqRSTUVwxYZ

# Puerto para el bot (por defecto: 3978)
BOT_PORT=3978

# ============================================
# CONFIGURACIÓN DEL DASHBOARD
# ============================================

# Puerto del dashboard (por defecto: 3000)
DASHBOARD_PORT=3000

# ============================================
# AMBIENTE
# ============================================

# development | production | test
NODE_ENV=development

# ============================================
# CONFIGURACIÓN OPCIONAL
# ============================================

# Log level: error | warn | info | debug
LOG_LEVEL=info

# Intervalo de monitoreo en ms (por defecto: 300000 = 5 min)
MONITORING_INTERVAL=300000

# Días para archivar alertas resueltas (por defecto: 30)
ALERT_ARCHIVE_DAYS=30

# Máximo de alertas en memoria (por defecto: 1000)
MAX_ALERTS_MEMORY=1000
```

---

## 🔌 Configuración de Alertas

### Editar: `data/alerts/rules.json`

```json
{
  "maintenanceThresholds": {
    "hoursThreshold": 500,
    "daysThreshold": 90,
    "priority": "high"
  },
  "machineFailure": {
    "downTimeThreshold": 1800000,
    "checkInterval": 300000,
    "priority": "critical"
  },
  "taskDeadline": {
    "hoursBeforeDeadline": 24,
    "priority": "high"
  },
  "downtime": {
    "continuousDowntimeHours": 4,
    "priority": "medium"
  },
  "production": {
    "deficitPercentage": 20,
    "priority": "medium"
  },
  "inventory": {
    "minimumStock": 10,
    "priority": "low"
  }
}
```

**Parámetros:**
- `hoursThreshold`: Horas de operación antes de alertar mantenimiento
- `daysThreshold`: Días sin mantenimiento antes de alertar
- `downTimeThreshold`: Milisegundos de inactividad para considerar fallo
- `checkInterval`: Intervalo en ms entre chequeos automáticos
- `hoursBeforeDeadline`: Horas antes del vencimiento para alertar
- `continuousDowntimeHours`: Horas consecutivas sin operación
- `deficitPercentage`: Porcentaje de déficit en producción

---

## 🏢 Configuración de Máquinas

### Estructura en `data/machines.json`

```json
{
  "machines": [
    {
      "id": "CNC-01",
      "nombre": "Centro de Maquinado Vertical",
      "estado": "activa",
      "eficiencia": 85,
      "horasOperacion": 450,
      "ultimoMantenimiento": "2024-01-15",
      "diasUltimoManten": 70,
      "tareasActuales": 2,
      "capacidad": 1000,
      "ubicacion": "Taller Principal",
      "modelo": "Haas VF-2",
      "notas": "En buen estado",
      "horasRestantesMantenimiento": 50
    },
    {
      "id": "CNC-02",
      "nombre": "Centro de Torneado",
      "estado": "activa",
      "eficiencia": 92,
      "horasOperacion": 120,
      "ultimoMantenimiento": "2024-01-05",
      "diasUltimoManten": 15,
      "tareasActuales": 1,
      "capacidad": 500,
      "ubicacion": "Taller Secundario",
      "modelo": "Okuma Cadet L",
      "notas": "Mantenimiento reciente",
      "horasRestantesMantenimiento": 380
    }
  ]
}
```

**Campos:**
- `estado`: "activa" | "mantenimiento" | "inactiva"
- `eficiencia`: 0-100 (porcentaje)
- `horasOperacion`: Total de horas acumuladas
- `diasUltimoManten`: Días desde último mantenimiento
- `capacidad`: Capacidad máxima en unidades

---

## 📋 Configuración de Tareas

### Estructura en `data/tasks.json`

```json
{
  "tasks": [
    {
      "id": "TASK-001",
      "titulo": "Fabricar Panel Aluminio",
      "descripcion": "Fabricar panel de aluminio para cliente XYZ",
      "maquina": "CNC-01",
      "estado": "en-progreso",
      "progreso": 80,
      "prioridad": "alta",
      "fechaCreacion": "2024-01-10",
      "fechaVencimiento": "2024-01-22",
      "diasRestantes": 2,
      "creadoPor": "usuario@bot",
      "asignadoA": "operador@bot",
      "notas": "Cliente Premium - Urgente"
    }
  ]
}
```

**Estados válidos:**
- "pendiente"
- "en-progreso"
- "completada"
- "cancelada"

**Prioridades:**
- "baja"
- "media"
- "alta"
- "crítica"

---

## 🚨 Configuración de Alertas Actuales

### Ver: `data/alerts/alerts.json`

```json
{
  "alerts": [
    {
      "id": "ALERT-001",
      "tipo": "maintenance",
      "prioridad": "high",
      "estado": "active",
      "titulo": "Mantenimiento Requerido - CNC-01",
      "descripcion": "La máquina CNC-01 ha completado 520 horas de operación sin mantenimiento.",
      "datos": {
        "maquina": "CNC-01",
        "horas": 520,
        "diasUltimoManten": 70
      },
      "creada": "2024-01-20T13:45:22.000Z",
      "actualizada": "2024-01-20T15:47:50.000Z",
      "creadoPor": "system",
      "reconocidaPor": "supervisor@bot",
      "reconocidaEn": "2024-01-20T14:10:00.000Z",
      "resueltaPor": null,
      "resueltaEn": null,
      "respuesta": "Técnico asignado"
    }
  ]
}
```

---

## 🎨 Personalización de CSS

### Editar: `public/css/style.css`

#### Variables de Color
```css
:root {
  /* Colores primarios */
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #0dcaf0;
  --dark-color: #212529;
  --light-color: #f8f9fa;
  
  /* Colores personalizados */
  --machine-active: #198754;
  --machine-maintenance: #ffc107;
  --alert-critical: #dc3545;
  --alert-high: #ff6b6b;
  --alert-medium: #ffc107;
  --alert-low: #0dcaf0;
}
```

#### Personalización de Temas
```css
/* Tema Oscuro */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #ffffff;
  }
  .card {
    background-color: #2a2a2a;
    border-color: #444;
  }
}

/* Tema Claro (por defecto) */
body {
  background-color: #ffffff;
  color: #212529;
}
```

---

## 📊 Configuración de Monitoreo

### En: `services/monitoringService.js`

```javascript
// Intervalo de chequeo (en ms)
const CHECK_INTERVAL = 5 * 60 * 1000;  // 5 minutos

// Tipos de chequeos habilitados
const CHECKS = {
  maintenanceCheck: true,
  downtimeCheck: true,
  taskDeadlineCheck: true,
  productionCheck: true,
  cleanupOldAlerts: true
};

// Configuración de limpieza
const CLEANUP_CONFIG = {
  enabled: true,
  archiveAfterDays: 30,
  deleteAfterDays: 90
};
```

---

## 📡 Configuración de API

### En: `services/dashboardServer.js`

```javascript
// Puerto del servidor
const PORT = process.env.DASHBOARD_PORT || 3000;

// CORS
const CORS_OPTIONS = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization']
};

// Auto-refresh del cliente (ms)
const CLIENT_REFRESH_INTERVAL = 5000;  // 5 segundos

// Límites
const LIMITS = {
  alertsPerPage: 50,
  tasksPerPage: 20,
  machinesPerPage: 10
};
```

---

## 🤖 Configuración del Bot

### En: `bot.js`

```javascript
// Opciones del adaptador
const ADAPTER_OPTIONS = {
  appId: process.env.TELEGRAM_BOT_TOKEN,
  appPassword: '',
  channelService: 'https://smba.trafficmanager.net/amer/',
  authorizationEndpoint: 'https://login.microsoftonline.com/botframework.com/oauth2/v2.0/authorize'
};

// Opciones de diálogo
const DIALOG_OPTIONS = {
  lazyLoadedBotServices: false
};

// Timeout para respuestas
const MESSAGE_TIMEOUT = 30000;  // 30 segundos
```

---

## 🔔 Notificaciones

### En: `services/notificationService.js`

```javascript
// Canales de notificación habilitados
const NOTIFICATION_CHANNELS = {
  telegram: true,
  email: false,      // No implementado aún
  sms: false,        // No implementado aún
  push: false        // No implementado aún
};

// Formato de mensajes
const MESSAGE_FORMAT = {
  emoji: true,       // Usar emojis
  markdown: true,    // Usar markdown
  html: false        // No usar HTML
};

// Límite de notificaciones por usuario
const RATE_LIMIT = {
  enabled: true,
  perMinute: 10,
  perHour: 100
};
```

---

## 📚 Configuración de Base de Datos

### En: `services/workshopDatabase.js`

```javascript
// Rutas de almacenamiento
const DATA_PATHS = {
  machines: 'data/machines.json',
  tasks: 'data/tasks.json',
  users: 'data/users.json',
  alerts: 'data/alerts/alerts.json',
  rules: 'data/alerts/rules.json'
};

// Configuración de respaldo
const BACKUP_CONFIG = {
  enabled: true,
  interval: 3600000,  // 1 hora
  keepVersions: 5
};

// Validación
const VALIDATION = {
  strictMode: true,
  checkConstraints: true
};
```

---

## 🔐 Configuración de Seguridad

### Recomendado para Producción

```javascript
// Autenticación
const AUTH_CONFIG = {
  enabled: true,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpire: '24h'
};

// Rate Limiting
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100                    // 100 requests por ventana
};

// HTTPS
const HTTPS_CONFIG = {
  enabled: true,
  cert: process.env.SSL_CERT,
  key: process.env.SSL_KEY
};

// Validación de Input
const INPUT_VALIDATION = {
  sanitize: true,
  maxLength: 1000,
  allowedTags: []
};
```

---

## 📈 Configuración de Reportes

### En: `services/reportManager.js`

```javascript
// Formatos soportados
const FORMATS = {
  json: true,
  csv: true,
  pdf: false,      // No implementado aún
  excel: false     // No implementado aún
};

// Período de retención
const RETENTION = {
  days: 90,
  autoDelete: true
};

// Campos incluidos en reportes
const REPORT_FIELDS = {
  machines: ['id', 'estado', 'eficiencia', 'horasOperacion'],
  tasks: ['id', 'titulo', 'estado', 'progreso', 'vencimiento'],
  alerts: ['id', 'tipo', 'prioridad', 'estado', 'creada']
};
```

---

## 🎯 Ejemplos de Personalización

### Cambiar Color de Alertas Críticas
```css
/* En style.css */
.alert-critical {
  background-color: #ff4444 !important;  /* Rojo más brillante */
  border-color: #cc0000 !important;
}
```

### Aumentar Intervalo de Monitoreo
```bash
# En .env
MONITORING_INTERVAL=600000  # 10 minutos
```

### Cambiar Umbral de Mantenimiento
```json
/* En data/alerts/rules.json */
{
  "maintenanceThresholds": {
    "hoursThreshold": 1000,
    "daysThreshold": 180
  }
}
```

### Agregar Nueva Máquina
```json
/* Agregar a data/machines.json */
{
  "id": "CNC-05",
  "nombre": "Nueva Máquina",
  "estado": "activa",
  "eficiencia": 0,
  "horasOperacion": 0,
  "ultimoMantenimiento": "2024-01-20",
  "diasUltimoManten": 0,
  "tareasActuales": 0,
  "capacidad": 1000,
  "ubicacion": "Taller Principal",
  "modelo": "Modelo XYZ",
  "notas": "Recién instalada"
}
```

---

## 📱 Configuración de Frontend

### En: `public/js/utils.js`

```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Intervalo de auto-refresh (ms)
const AUTO_REFRESH_INTERVAL = 5000;

// Timeout de requests
const REQUEST_TIMEOUT = 30000;

// Notificaciones
const NOTIFICATION_CONFIG = {
  duration: 3000,      // 3 segundos
  position: 'top-end', // bootstrap-toast
  animation: true
};

// Gráficos
const CHART_CONFIG = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750
  }
};
```

---

## 🚀 Deployment

### Variables para Producción

```env
NODE_ENV=production
TELEGRAM_BOT_TOKEN=token_produccion
BOT_PORT=80
DASHBOARD_PORT=443
LOG_LEVEL=warn
MONITORING_INTERVAL=600000
SSL_CERT=/path/to/cert.pem
SSL_KEY=/path/to/key.pem
JWT_SECRET=secreto_muy_largo_y_seguro
```

---

## ✅ Checklist de Configuración

- [ ] `.env` creado con token válido
- [ ] `data/machines.json` con máquinas reales
- [ ] `data/alerts/rules.json` con umbrales correctos
- [ ] Puertos disponibles (3978, 3000)
- [ ] Node.js actualizado (v14+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Permisos de carpeta `data/` configurados
- [ ] Para producción: HTTPS, autenticación, backups

---

Para más información sobre cada configuración, ver la documentación específica en `ALERTS_GUIDE.md`, `DASHBOARD_GUIDE.md` o comentarios en el código fuente.
