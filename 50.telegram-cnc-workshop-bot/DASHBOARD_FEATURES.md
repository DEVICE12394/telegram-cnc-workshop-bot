# 🎨 Features del Dashboard - Referencia Visual

Guía detallada de todas las características y componentes visuales del dashboard.

---

## 📊 1. Dashboard Principal (/) 

### Layout
```
┌─────────────────────────────────────────────────────┐
│ 🏭 CNC Workshop Dashboard                    Home   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 Total Máquinas  |  🟢 Activas  |  🟡 Mant.    │
│     4               |     3         |     1        │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Alertas         │  │ Estado Máquinas │       │
│  │ Crítica: 2  📈  │  │ Activas: 75%    │       │
│  │ Alta: 5    📊   │  │ (Gráfico Pie)   │       │
│  │ Media: 8        │  │                  │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Tareas          │  │ Eficiencia Prom  │       │
│  │ Pendientes: 3   │  │ 85% ⭐⭐⭐⭐     │       │
│  │ En Prog: 2      │  │ (Gráfico Línea)  │       │
│  │ Completadas: 8  │  │                  │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Componentes

#### Tarjetas de Estadísticas (4)
```javascript
// Estructura
{
  icon: '📊',
  label: 'Total Máquinas',
  value: 4,
  color: '#0d6efd'
}
```

**Características:**
- Números en grande (48px)
- Iconos visuales
- Colores según estado
- Click para ir a sección

#### Gráficos
1. **Alertas Activas** (Doughnut - Pastel)
   - Verde: Resueltas
   - Naranja: Reconocidas
   - Rojo: Activas

2. **Estado Máquinas** (Bar - Barras)
   - Eje Y: Máquinas
   - Eje X: Porcentaje de operación

3. **Tareas por Estado** (Doughnut)
   - Azul: Pendientes
   - Naranja: En progreso
   - Verde: Completadas

4. **Eficiencia Global** (Line - Línea)
   - Línea por máquina
   - Últimas 24h
   - Promedio general

### Comportamiento
```javascript
// Auto-actualización cada 5 segundos
autoRefresh(() => loadDashboardData(), 5000);

// Clic en tarjeta → ir a sección
$('.stat-card').on('click', function() {
  window.location.href = $(this).data('link');
});

// Click en legend → mostrar/ocultar serie en gráfico
chart.options.animation.duration = 500;
```

---

## 🚨 2. Alertas (/alerts)

### Estructura
```
┌─────────────────────────────────────────────────────┐
│ 🏭 CNC Workshop        [Dashboard][Alertas][...]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Filtros:                                           │
│ [Estado: Todos ▼] [Prioridad: Todas ▼]           │
│                                                     │
│ 📊 Resumen:                                        │
│ Activas: 5  |  Reconocidas: 3  |  Resueltas: 12  │
│                                                     │
│ 🚨 Alertas (Filtradas: 8):                        │
│ ┌─────────────────────────────────────────────┐   │
│ │ 🔴 CRÍTICA - Máquina CNC-01 Fuera Servicio│   │
│ │ hace 2h | Mantenimiento requerido          │   │
│ │ [Ver Detalles]                             │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ 🟠 ALTA - Tarea "Panel Aluminio" Vencida  │   │
│ │ hace 5m | Vencimiento: 2024-01-20 15:30    │   │
│ │ [Ver Detalles]                             │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Componentes

#### Controles de Filtro
```javascript
// Estados disponibles
estados = ['Todas', 'Activas', 'Reconocidas', 'Resueltas']

// Prioridades
prioridades = ['Todas', 'Crítica', 'Alta', 'Media', 'Baja']

// Filtrado en tiempo real
filters.estado = select.value;
filters.prioridad = select.value;
refreshAlerts(filters);
```

#### Tarjeta de Alerta
```javascript
{
  icon: '🔴',        // Rojo: crítica, Naranja: alta, etc.
  tipo: 'CRÍTICA',
  mensaje: 'Máquina CNC-01 Fuera Servicio',
  timestamp: '2024-01-20 13:45',
  tiempoAgo: 'hace 2h',
  detalles: 'Mantenimiento requerido urgentemente'
}
```

**Colores por Prioridad:**
- 🔴 Crítica: #dc3545 (Rojo)
- 🟠 Alta: #ffc107 (Naranja)
- 🟡 Media: #0dcaf0 (Azul)
- 🟢 Baja: #198754 (Verde)

#### Modal de Detalles
```
┌──────────────────────────────────────────┐
│ Detalles de Alerta                   ✕  │
├──────────────────────────────────────────┤
│                                          │
│ Tipo:        Mantenimiento               │
│ Prioridad:   🔴 Crítica                 │
│ Estado:      Activa                      │
│ Máquina:     CNC-01                      │
│ Horas:       520h desde último servicio │
│ Creada:      2024-01-20 13:45:22        │
│ Última act.: hace 2h                     │
│                                          │
│ Descripción:                             │
│ Se ha detectado que la máquina CNC-01   │
│ ha completado 520 horas de operación    │
│ sin mantenimiento. Se recomienda         │
│ realizar mantenimiento preventivo.       │
│                                          │
│ [Reconocer] [Resolver]                  │
│                                          │
└──────────────────────────────────────────┘
```

### Acciones

#### Reconocer Alerta
```javascript
POST /api/alerts/:id/acknowledge
Body: { userId: 'dashboard-user', timestamp: Date.now() }

Response: { status: 'acknowledged', acknowledgedBy: '...', acknowledgedAt: '...' }
```

#### Resolver Alerta
```javascript
POST /api/alerts/:id/resolve
Body: { userId: 'dashboard-user', timestamp: Date.now() }

Response: { status: 'resolved', resolvedBy: '...', resolvedAt: '...' }
```

---

## 🔧 3. Máquinas (/machines)

### Estructura
```
┌─────────────────────────────────────────────────────┐
│ 🏭 CNC Workshop        [Dashboard][Máquinas]...    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📊 Resumen:                                        │
│ Total: 4  |  Activas: 3 (75%)  |  Mantenimiento: 1│
│                                                     │
│ 🔧 Máquinas:                                       │
│                                                     │
│ ┌───────────────────┐  ┌───────────────────┐      │
│ │ 🟢 CNC-01         │  │ 🟢 CNC-02         │      │
│ │ Estado: Activa    │  │ Estado: Activa    │      │
│ │ Eficiencia: 85%   │  │ Eficiencia: 92%   │      │
│ │ Horas: 450h       │  │ Horas: 120h       │      │
│ │ Últ. Mant: 70d    │  │ Últ. Mant: 15d    │      │
│ │ [Detalles]        │  │ [Detalles]        │      │
│ └───────────────────┘  └───────────────────┘      │
│                                                     │
│ ┌───────────────────┐  ┌───────────────────┐      │
│ │ 🟡 CNC-03         │  │ 🟢 CNC-04         │      │
│ │ Estado: Manten.   │  │ Estado: Activa    │      │
│ │ Eficiencia: 0%    │  │ Eficiencia: 78%   │      │
│ │ Horas: 0h         │  │ Horas: 280h       │      │
│ │ Últ. Mant: 5d     │  │ Últ. Mant: 45d    │      │
│ │ [Detalles]        │  │ [Detalles]        │      │
│ └───────────────────┘  └───────────────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Card de Máquina
```javascript
{
  id: 'CNC-01',
  estado: 'activa',        // activa | mantenimiento
  eficiencia: 85,          // 0-100%
  horasOperacion: 450,
  diasUltimoManten: 70,
  tareasActuales: 2,
  fechaUltimoManten: '2024-01-15'
}
```

**Estilos:**
```css
.machine-card {
  border-left: 5px solid;  /* Verde activa, Naranja mant */
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s;
}

.machine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### Modal de Máquina
```
┌──────────────────────────────────────────┐
│ Detalles de Máquina - CNC-01        ✕   │
├──────────────────────────────────────────┤
│                                          │
│ Estado: 🟢 Activa                       │
│ Eficiencia: ⭐⭐⭐⭐ 85%                 │
│                                          │
│ Operación:                               │
│ • Horas totales: 450h                    │
│ • Última actividad: hace 15m             │
│ • Tareas activas: 2                      │
│                                          │
│ Mantenimiento:                           │
│ • Último: 2024-01-15 (70 días)          │
│ • Estado: ⚠️ Próximo recomendado en 20d │
│                                          │
│ Registrar Mantenimiento:                 │
│ [Fecha: 2024-01-20 ▼] [Hora: 14:30 ▼]  │
│ [Descripción: ____________]              │
│ [Registrar]                              │
│                                          │
└──────────────────────────────────────────┘
```

### Acciones
```javascript
// Registrar mantenimiento
POST /api/machines/:id
Body: {
  lastMaintenance: Date,
  maintenanceHours: Number,
  notes: String
}

// Ver historial
GET /api/machines/:id/history
```

---

## 📋 4. Tareas (/tasks)

### Estructura
```
┌─────────────────────────────────────────────────────┐
│ 🏭 CNC Workshop        [Dashboard][Tareas]....     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📊 Resumen:                                        │
│ Pendientes: 3  |  En Progreso: 2  |  Completadas: 8│
│                                                     │
│ 📋 Tareas:                                         │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Fabricar Panel Aluminio                 80% │   │
│ │ CNC-01 • Vence: 2024-01-22 • 2 días    [*]  │   │
│ │ ████████████████░░ Progreso             │   │
│ │ [Ver Detalles]                          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Corte de Acero Inoxidable              45%  │   │
│ │ CNC-02 • Vence: 2024-01-25 • 5 días    [ ]  │   │
│ │ ████████░░░░░░░░░░░░ Progreso          │   │
│ │ [Ver Detalles]                          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ [+ Nueva Tarea]                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Card de Tarea
```javascript
{
  id: 'TASK-001',
  titulo: 'Fabricar Panel Aluminio',
  maquina: 'CNC-01',
  estado: 'en-progreso',        // pendiente | en-progreso | completada
  progreso: 80,                 // 0-100%
  fechaVencimiento: '2024-01-22',
  diasRestantes: 2,
  prioridad: 'alta',            // baja | media | alta | crítica
  descripcion: '...',
  creada: '2024-01-10',
  creadoPor: 'usuario@bot'
}
```

**Indicador de Urgencia:**
- 🟢 Verde: >7 días
- 🟡 Amarillo: 3-7 días
- 🟠 Naranja: 1-3 días
- 🔴 Rojo: <1 día o vencida

### Modal de Nueva Tarea
```
┌──────────────────────────────────────────┐
│ Nueva Tarea                           ✕  │
├──────────────────────────────────────────┤
│                                          │
│ Título: [___________________________]   │
│                                          │
│ Descripción:                             │
│ [_________________________________]    │
│ [_________________________________]    │
│                                          │
│ Máquina: [CNC-01 ▼]                    │
│                                          │
│ Fecha Vencimiento:                       │
│ [2024-01-22 ▼] [15:30 ▼]               │
│                                          │
│ Prioridad: [Alta ▼]                    │
│                                          │
│ [Crear Tarea] [Cancelar]                │
│                                          │
└──────────────────────────────────────────┘
```

### Modal de Detalles
```
┌──────────────────────────────────────────┐
│ Detalles de Tarea               ✕       │
├──────────────────────────────────────────┤
│                                          │
│ Fabricar Panel Aluminio                  │
│ Estado: En Progreso  🟠 80%             │
│                                          │
│ Máquina: CNC-01                          │
│ Prioridad: 🔴 Alta                      │
│ Vencimiento: 2024-01-22 (2 días) ⏰    │
│                                          │
│ Creada: 2024-01-10 por usuario@bot      │
│ Última actualización: hace 30m           │
│                                          │
│ Descripción:                             │
│ Fabricar panel de aluminio para         │
│ cliente XYZ, dimensiones 50x100mm       │
│                                          │
│ Progreso: [████████░░░░░░░░░░░░] 80%  │
│ Actualizar: [_____] %                   │
│                                          │
│ [Actualizar] [Completar] [Cancelar]     │
│                                          │
└──────────────────────────────────────────┘
```

### Acciones
```javascript
// Crear tarea
POST /api/tasks
Body: {
  titulo: String,
  descripcion: String,
  maquina: String,
  fechaVencimiento: Date,
  prioridad: String
}

// Actualizar progreso
PUT /api/tasks/:id
Body: { progreso: 0-100 }

// Marcar completada
PUT /api/tasks/:id
Body: { estado: 'completada' }
```

---

## 📈 5. Estadísticas (/analytics)

### Estructura
```
┌─────────────────────────────────────────────────────┐
│ 🏭 CNC Workshop    [Dashboard][Estadísticas]...   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─────────────────┐  ┌─────────────────┐          │
│ │ Máquinas        │  │ Tareas          │          │
│ │ (Pie Chart)     │  │ (Pie Chart)     │          │
│ │  Activas: 75%   │  │ Completadas: 62%│          │
│ │  Mant: 25%      │  │ En Progreso: 25%│          │
│ │                 │  │ Pendientes: 13% │          │
│ └─────────────────┘  └─────────────────┘          │
│                                                     │
│ ┌─────────────────────────────────────────┐        │
│ │ Horas de Operación por Máquina          │        │
│ │ (Bar Chart)                             │        │
│ │                                         │        │
│ │ CNC-01 ███████████░░░░░░ 450h         │        │
│ │ CNC-02 █████░░░░░░░░░░░░░░ 120h       │        │
│ │ CNC-03 ░░░░░░░░░░░░░░░░░░░░ 0h        │        │
│ │ CNC-04 ████████░░░░░░░░░░░░░ 280h     │        │
│ │                                         │        │
│ └─────────────────────────────────────────┘        │
│                                                     │
│ 📊 Eficiencia de Máquinas:                        │
│ ┌────────────────────────────────────────┐        │
│ │ Máquina  | Eficiencia | Horas | Estado │        │
│ │────────────────────────────────────────│        │
│ │ CNC-01   | ⭐⭐⭐⭐ 85%  | 450h  | 🟢    │        │
│ │ CNC-02   | ⭐⭐⭐⭐⭐ 92% | 120h  | 🟢    │        │
│ │ CNC-03   | ☆☆☆☆☆ 0%   | 0h    | 🟡    │        │
│ │ CNC-04   | ⭐⭐⭐ 78%   | 280h  | 🟢    │        │
│ │────────────────────────────────────────│        │
│ │ PROMEDIO | ⭐⭐⭐⭐ 82%  | 850h  | ✓    │        │
│ │────────────────────────────────────────│        │
│ └────────────────────────────────────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Gráficos

#### 1. Distribución de Máquinas (Doughnut)
```javascript
{
  labels: ['Activas', 'Mantenimiento'],
  data: [3, 1],
  backgroundColor: ['#198754', '#ffc107'],
  borderColor: ['#fff'],
  borderWidth: 2
}
```

#### 2. Distribución de Tareas (Doughnut)
```javascript
{
  labels: ['Completadas', 'En Progreso', 'Pendientes'],
  data: [62, 25, 13],
  backgroundColor: ['#198754', '#0dcaf0', '#ffc107'],
  borderColor: ['#fff'],
  borderWidth: 2
}
```

#### 3. Horas de Operación (Bar)
```javascript
{
  labels: ['CNC-01', 'CNC-02', 'CNC-03', 'CNC-04'],
  datasets: [{
    label: 'Horas de Operación',
    data: [450, 120, 0, 280],
    backgroundColor: '#0d6efd'
  }]
}
```

#### 4. Eficiencia por Máquina (Table)
```
| Máquina | Eficiencia | Horas | Estado |
|---------|-----------|-------|--------|
| CNC-01  | 85%       | 450h  | 🟢    |
| CNC-02  | 92%       | 120h  | 🟢    |
| CNC-03  | 0%        | 0h    | 🟡    |
| CNC-04  | 78%       | 280h  | 🟢    |
```

---

## 🎨 Elementos Comunes

### Navbar
```
┌─────────────────────────────────────────────┐
│ 🏭 CNC Workshop [Dashboard][Alertas][...]   │
├─────────────────────────────────────────────┤
```

**Links Activos:**
- Dashboard (/)
- Alertas (/alerts)
- Máquinas (/machines)
- Tareas (/tasks)
- Estadísticas (/analytics)

### Notificaciones Toast
```
┌──────────────────────────┐
│ ✓ Operación exitosa      │  (Verde)
└──────────────────────────┘

┌──────────────────────────┐
│ ⚠ Advertencia            │  (Amarillo)
└──────────────────────────┘

┌──────────────────────────┐
│ ✕ Error en operación     │  (Rojo)
└──────────────────────────┘

┌──────────────────────────┐
│ ℹ Información            │  (Azul)
└──────────────────────────┘
```

### Colores
```css
--primary-color: #0d6efd      /* Azul */
--success-color: #198754      /* Verde */
--danger-color: #dc3545       /* Rojo */
--warning-color: #ffc107      /* Naranja */
--info-color: #0dcaf0         /* Azul Claro */
--dark-color: #212529         /* Negro */
--light-color: #f8f9fa        /* Gris Claro */
```

### Iconos Emoji
```
🏭 Taller/Fabrica
🟢 Activa
🟡 Mantenimiento
🟠 Advertencia
🔴 Crítica/Fallo
📊 Datos/Dashboard
🚨 Alerta
🔧 Máquina/Mantenimiento
📋 Tareas
📈 Estadísticas/Gráficos
⏰ Tiempo/Vencimiento
✓ Completado/Éxito
✕ Error
ℹ Información
⭐ Calificación/Eficiencia
```

---

## 🔄 Flujos de Interacción

### Crear y Completar una Tarea
```
1. Ir a Tareas (/tasks)
2. Click [+ Nueva Tarea]
3. Llenar formulario
4. Click [Crear Tarea]
5. ✓ Toast: "Tarea creada exitosamente"
6. Aparece en lista
7. Click [Ver Detalles]
8. Actualizar progreso: 0% → 100%
9. Click [Completar]
10. ✓ Se mueve a "Completadas"
```

### Responder a una Alerta
```
1. Ir a Alertas (/alerts)
2. Ver alerta en estado "Activa"
3. Click [Ver Detalles]
4. Leer información completa
5. Click [Reconocer]
6. ✓ Estado → "Reconocida"
7. Investigar/Resolver problema
8. Click [Resolver]
9. ✓ Estado → "Resuelta"
10. Auto-archivo después de 30 días
```

### Registrar Mantenimiento
```
1. Ir a Máquinas (/machines)
2. Click en máquina que requiere mantenimiento
3. Click [Detalles]
4. Scroll a "Registrar Mantenimiento"
5. Seleccionar fecha y hora
6. Escribir descripción
7. Click [Registrar]
8. ✓ Toast: "Mantenimiento registrado"
9. "Última revisión" se actualiza
10. Contador de días resetea a 0
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop (>992px) */
- 2-3 columnas en grillas
- Navbar horizontal completo
- Gráficos lado a lado

/* Tablet (768px - 992px) */
- 2 columnas en grillas
- Navbar con menú adaptado
- Gráficos apilados

/* Móvil (<768px) */
- 1 columna en grillas
- Navbar hamburguesa
- Gráficos full-width
- Modales full-screen
```

---

## 🎯 Casos de Uso

### Caso 1: Supervisor de Taller
**Objetivo:** Monitorear el estado general
**Flujo:**
1. Abre Dashboard principal
2. Ve tarjetas de resumen
3. Identifica 2 alertas críticas
4. Navega a /alerts
5. Reconoce y comienza a resolver

### Caso 2: Operador de Máquina
**Objetivo:** Reportar finalización de tarea
**Flujo:**
1. Abre /tasks
2. Encuentra su tarea asignada
3. Actualiza progreso a 100%
4. Marca como completada
5. Sistema notifica a supervisor

### Caso 3: Técnico de Mantenimiento
**Objetivo:** Registrar servicio de máquina
**Flujo:**
1. Abre /machines
2. Encuentra máquina que sirvió
3. Abre modal de detalles
4. Registra fecha y descripción del mantenimiento
5. Confirma operación

---

## 🚀 Performance

**Optimizaciones:**
- Auto-actualización cada 5 segundos (configurable)
- Caché de datos en localStorage
- Lazy loading de gráficos
- Compresión de imágenes
- Minificación de CSS/JS

**Tiempos típicos:**
- Carga inicial: <2s
- Actualización de datos: <500ms
- Renderizado de gráficos: <1s

---

Este documento proporciona una referencia visual completa de todas las características del dashboard web.
