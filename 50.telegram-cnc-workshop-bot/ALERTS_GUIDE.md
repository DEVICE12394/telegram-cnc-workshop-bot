# 🚨 Sistema de Alertas del Bot CNC

Documentación completa del sistema avanzado de alertas y monitoreo en tiempo real.

## 📋 Tabla de Contenidos

1. [Tipos de Alertas](#tipos-de-alertas)
2. [Niveles de Prioridad](#niveles-de-prioridad)
3. [Cómo Funciona](#cómo-funciona)
4. [Gestión de Alertas](#gestión-de-alertas)
5. [Configuración](#configuración)
6. [Ejemplos](#ejemplos)

---

## 🎯 Tipos de Alertas

### 1. **Mantenimiento Preventivo** 🔧
- **Tipo:** `maintenance`
- **Cuándo:** Máquina requiere mantenimiento
- **Disparadores:**
  - Horas de operación > 500h
  - Días desde último mantenimiento > 90 días
- **Prioridad:** Alta
- **Acción:** Programar revisión técnica

### 2. **Fallo de Máquina** 🚨
- **Tipo:** `machine_failure`
- **Cuándo:** Máquina deja de responder
- **Disparadores:**
  - Inactividad > 30 minutos
- **Prioridad:** CRÍTICA
- **Acción:** Verificar estado inmediatamente

### 3. **Tarea Próxima a Vencer** ⏰
- **Tipo:** `task_deadline`
- **Cuándo:** Tarea a punto de vencer
- **Disparadores:**
  - Menos de 24h para vencer
  - Tarea ya vencida
- **Prioridad:** Media
- **Acción:** Acelerar producción o reprogramar

### 4. **Alerta de Producción** 📉
- **Tipo:** `production_alert`
- **Cuándo:** Meta de producción en riesgo
- **Disparadores:**
  - Déficit > 20% de la meta esperada
- **Prioridad:** Media
- **Acción:** Revisar eficiencia de máquinas

### 5. **Máquina Inactiva** ⏸️
- **Tipo:** `downtime_alert`
- **Cuándo:** Máquina sin trabajar mucho tiempo
- **Disparadores:**
  - Inactividad continua > 4 horas
- **Prioridad:** Alta
- **Acción:** Asignar nueva tarea o revisar

### 6. **Inventario Bajo** 📦
- **Tipo:** `inventory_low`
- **Cuándo:** Stock por debajo del mínimo
- **Disparadores:**
  - Stock < Nivel mínimo
- **Prioridad:** Media
- **Acción:** Realizar pedido

### 7. **Error del Sistema** ⚠️
- **Tipo:** `system_error`
- **Cuándo:** Fallo interno
- **Disparadores:**
  - Excepciones no controladas
- **Prioridad:** CRÍTICA
- **Acción:** Contactar soporte

---

## 🎚️ Niveles de Prioridad

```
🚨 CRÍTICA   - Requiere acción inmediata (máquina caída, error fatal)
⚠️  ALTA     - Importante, revisar pronto (mantenimiento, inactividad)
⏰ MEDIA    - Revisar en el día (tareas vencidas, producción)
ℹ️  BAJA     - Informativas (eventos menores)
```

### Respuesta por Prioridad

| Prioridad | Notificación | Tiempo Respuesta |
|-----------|-------------|-----------------|
| CRÍTICA   | Inmediata   | < 5 minutos     |
| ALTA      | Inmediata   | < 30 minutos    |
| MEDIA     | Dentro 1h   | < 2 horas       |
| BAJA      | Diario      | < 1 día         |

---

## 🔄 Cómo Funciona

### Flujo de Alertas

```
1. DETECCIÓN
   ↓
   MonitoringService verifica condiciones cada 5 minutos
   ↓
2. CREACIÓN
   ↓
   AlertManager crea alerta si no es duplicada
   ↓
3. NOTIFICACIÓN
   ↓
   NotificationService envía por Telegram
   ↓
4. GESTIÓN
   ↓
   Usuario: Reconoce, Resuelve o Ignora
```

### Monitoreo Automático

El sistema verifica continuamente:

```javascript
// Cada 5 minutos (configurable)
- checkMachinesMaintenance()     // Máquinas vencidas
- checkMachinesDowntime()        // Máquinas inactivas
- checkTaskDeadlines()           // Tareas vencidas
- checkProductionTargets()       // Meta de producción
- cleanupOldAlerts()             // Limpieza de datos
```

---

## 🛠️ Gestión de Alertas

### Estados de Alerta

```
ACTIVE      - Nueva alerta, requiere atención
   ↓
ACKNOWLEDGED - Usuario reconoció
   ↓
RESOLVED    - Problema solucionado
   ↓
ARCHIVED    - Guardada en historial
```

### Operaciones Disponibles

#### Ver Alertas
```
Comando: alertas
Muestra: Resumen de alertas activas, agrupadas por prioridad
```

#### Reconocer Alerta
```
Acción: /acknowledge{alertId}
Cambio: active → acknowledged
Efecto: La alerta sigue visible pero marcada
```

#### Resolver Alerta
```
Acción: /resolve{alertId}
Cambio: active/acknowledged → resolved
Efecto: Se archiva después de 30 días
```

#### Ver Detalles
```
Acción: /alert_detail{alertId}
Muestra: Información completa de la alerta
```

---

## ⚙️ Configuración

### Archivo: `data/alerts/rules.json`

```json
{
  "maintenance": {
    "enabled": true,
    "hoursThreshold": 500,
    "daysThreshold": 90,
    "priority": "high"
  },
  "machine_failure": {
    "enabled": true,
    "downTimeThreshold": 1800000,
    "priority": "critical"
  },
  "task_deadline": {
    "enabled": true,
    "hoursBeforeDeadline": 24,
    "priority": "medium"
  }
}
```

### Personalizar Umbrales

```javascript
// Cambiar umbral de horas de mantenimiento
alertManager.updateRule('maintenance', {
  hoursThreshold: 600  // Antes: 500h
});

// Cambiar tiempo de inactividad
alertManager.updateRule('downtime_alert', {
  continuousDowntimeHours: 8  // Antes: 4h
});

// Deshabilitar un tipo de alerta
alertManager.updateRule('inventory_low', {
  enabled: false
});
```

---

## 📊 API del Sistema de Alertas

### AlertManager

```javascript
const { AlertManager, AlertTypes, AlertPriority } = require('./services/alertManager');

const alertManager = new AlertManager();

// Crear alerta
alertManager.createAlert(AlertTypes.MACHINE_FAILURE, {
  machineId: 'CNC-01',
  downtimeMinutes: 45
});

// Obtener alertas
alertManager.getActiveAlerts();           // Solo activas
alertManager.getAlerts({ status: 'active' });
alertManager.getAlertsByPriority('critical');

// Gestionar
alertManager.acknowledgeAlert(alertId, userId);
alertManager.resolveAlert(alertId);

// Estadísticas
alertManager.getAlertsSummary();
alertManager.getStats();
```

### NotificationService

```javascript
const { NotificationService } = require('./services/notificationService');

const notificationService = new NotificationService(telegramAdapter);

// Registrar usuario
notificationService.registerUser(userId, chatId);

// Enviar notificación
await notificationService.sendNotification(alert);
await notificationService.sendAlertsSummary(alertManager, chatId);
await notificationService.sendMaintenanceAlert(machine, chatId);

// Boletines
await notificationService.sendDailyBulletin(alertManager, database, chatId);
```

### MonitoringService

```javascript
const { MonitoringService } = require('./services/monitoringService');

const monitoringService = new MonitoringService(alertManager, database);

// Iniciar/detener
monitoringService.startMonitoring(300000);  // Cada 5 minutos
monitoringService.stopMonitoring();

// Chequeo manual
monitoringService.forceCheck();

// Estado
monitoringService.getStatus();
```

---

## 📋 Ejemplos de Uso

### Ejemplo 1: Alerta de Mantenimiento

```
[MONITOREO]
Verifica: CNC-01 ha operado 520 horas
Condición: > 500 horas ✓
Resultado: Alerta creada

[TELEGRAM]
🔧 Mantenimiento debido: CNC-01
La máquina CNC-01 requiere mantenimiento preventivo...
Prioridad: Alta
ID: ALERT-1705000123456

Acciones: /acknowledge123456, /resolve123456
```

### Ejemplo 2: Tarea Próxima a Vencer

```
[MONITOREO]
Verifica: TASK-001 vence en 6 horas
Condición: < 24 horas ✓
Resultado: Alerta creada

[TELEGRAM]
⏰ Tarea próxima a vencer: TASK-001
La tarea "Fabricación serie A" vence en 6 horas
Máquina: CNC-01
Progreso: 65%

/acknowledge123457, /resolve123457
```

### Ejemplo 3: Máquina Inactiva

```
[MONITOREO]
Verifica: CNC-02 sin actividad
Tiempo: 4.5 horas
Condición: > 4 horas ✓
Resultado: Alerta creada

[TELEGRAM]
⏸️ Máquina inactiva: CNC-02
Fresadora CNC-02 está inactiva desde hace 4 horas
Verificar estado o asignar nueva tarea

/update_machine-02, /acknowledge123458
```

---

## 📈 Dashboard de Alertas

Para ver el estado completo en Telegram:

```
Comando: /dashboard

Respuesta:
📊 Dashboard de Alertas
🔴 Críticas: 1
⚠️ Altas: 3
⏰ Medias: 5
ℹ️ Bajas: 2
📈 Total Activas: 11

Últimas alertas...
```

---

## 🔍 Solución de Problemas

### No recibo alertas

1. Verificar que `TELEGRAM_BOT_TOKEN` sea válido
2. Confirmar que usuario está registrado: `notificationService.registerUser(userId, chatId)`
3. Verificar reglas habilitadas en `data/alerts/rules.json`
4. Revisar logs: `console.log(alertManager.getActiveAlerts())`

### Demasiadas alertas

1. Aumentar umbrales en configuración
2. Desactivar tipos de alerta innecesarios
3. Configurar `autoAcknowledgeAfterHours`
4. Usar: `alertManager.updateRule(type, { enabled: false })`

### Alertas antiguas acumuladas

1. Sistema limpia automáticamente cada 30 días
2. Forzar limpieza: `alertManager.cleanupOldAlerts(30)`
3. Ver estadísticas: `alertManager.getStats()`

---

## 🚀 Próximas Mejoras

- [ ] Alertas por SMS
- [ ] Escalamiento automático (si no se resuelve)
- [ ] Integración con email
- [ ] Panel web de alertas
- [ ] Historial detallado con gráficos
- [ ] Alertas condicionales complejas
- [ ] Rutinas automáticas de resolución

---

## 📞 Soporte

Para más ayuda o reportar problemas:
- Documenta el tipo de alerta
- Incluye logs del sistema
- Describe los pasos para reproducir
- Reporta en el repositorio del proyecto
