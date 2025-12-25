# 🌐 Dashboard Web - Guía de Uso

Documentación completa del dashboard web para la gestión del taller CNC.

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Dashboard](#acceso-al-dashboard)
3. [Páginas del Dashboard](#páginas-del-dashboard)
4. [Funcionalidades](#funcionalidades)
5. [API REST](#api-rest)
6. [Configuración](#configuración)

---

## 🎯 Introducción

El dashboard web proporciona una interfaz visual completa para monitorear y gestionar tu taller CNC. Es complementario al bot de Telegram y ofrece:

- **Visualización de datos** con gráficos interactivos
- **Gestión de máquinas, tareas y alertas**
- **Estadísticas y análisis en tiempo real**
- **API REST para integraciones externas**

---

## 🌐 Acceso al Dashboard

### URL Principal
```
http://localhost:3000
```

### Puertos
- **Bot Telegram**: `3978` (configurable)
- **Dashboard Web**: `3000` (configurable con `DASHBOARD_PORT`)

### Requisitos
- Node.js 14+
- NPM o Yarn
- Navegador moderno

---

## 📄 Páginas del Dashboard

### 1. **Dashboard Principal** (`/`)
**Descripción:** Vista general del estado del taller

**Elementos:**
- 4 tarjetas de estadísticas principales
- Gráficos de alertas, máquinas y tareas
- Gráfico de eficiencia por máquina
- Últimas alertas activas

**Características:**
- Auto-actualización cada 5 segundos
- Colores indicativos de estado
- Enlaces rápidos a otras secciones

### 2. **Alertas** (`/alerts`)
**Descripción:** Gestión completa del sistema de alertas

**Elementos:**
- Filtros por estado y prioridad
- Resumen de alertas por nivel
- Lista detallada de alertas
- Modal con información completa

**Acciones:**
- Filtrar alertas
- Ver detalles
- Reconocer alerta
- Resolver alerta

### 3. **Máquinas** (`/machines`)
**Descripción:** Monitoreo de máquinas CNC

**Elementos:**
- Tarjetas de resumen (Total, Activas, Mantenimiento)
- Cards individuales de máquinas
- Estado en tiempo real
- Información de eficiencia

**Acciones:**
- Ver detalles de máquina
- Registrar mantenimiento
- Ver historial de operación

### 4. **Tareas** (`/tasks`)
**Descripción:** Gestión de tareas y trabajos

**Elementos:**
- Resumen de tareas por estado
- Lista con barras de progreso
- Información de vencimiento
- Modal de detalles

**Acciones:**
- Crear nueva tarea
- Ver detalles
- Actualizar progreso
- Marcar como completada

### 5. **Estadísticas** (`/analytics`)
**Descripción:** Análisis y reportes

**Elementos:**
- Gráficos de distribución
- Gráfico de horas de operación
- Tabla detallada de máquinas
- Métricas de eficiencia

**Datos Mostrados:**
- Distribución de máquinas (Activas vs Mantenimiento)
- Distribución de tareas (Pendientes, En progreso, Completadas)
- Horas de operación por máquina
- Eficiencia global y por máquina

---

## 🔧 Funcionalidades

### Auto-Actualización
Todas las páginas se actualizan automáticamente cada 5 segundos:
```javascript
autoRefresh(loadFunction, 5000); // 5 segundos
```

### Gráficos Interactivos
Usando Chart.js para visualizaciones:
- Gráficos de pastel (Doughnut)
- Gráficos de barras (Bar)
- Leyendas clickeables
- Responsive design

### Notificaciones
Sistema de alertas visuales en tiempo real:
```javascript
showSuccess('Operación exitosa');
showError('Error al processar');
```

### Filtrado Dinámico
En la página de alertas:
- Por estado (Activas, Reconocidas, Resueltas)
- Por prioridad (Crítica, Alta, Media, Baja)
- Combinación de filtros

### Modales
Para interactuar sin cambiar de página:
- Ver detalles
- Crear nuevos registros
- Confirmar acciones

---

## 📡 API REST

Todos los endpoints disponibles del dashboard:

### Alertas
```
GET    /api/alerts                    # Listar alertas
GET    /api/alerts/summary            # Resumen de alertas
GET    /api/alerts/:id                # Detalles de alerta
POST   /api/alerts/:id/acknowledge    # Reconocer alerta
POST   /api/alerts/:id/resolve        # Resolver alerta
```

### Máquinas
```
GET    /api/machines                  # Listar máquinas
GET    /api/machines/:id              # Detalles de máquina
PUT    /api/machines/:id              # Actualizar máquina
```

### Tareas
```
GET    /api/tasks                     # Listar tareas
GET    /api/tasks/:id                 # Detalles de tarea
POST   /api/tasks                     # Crear tarea
PUT    /api/tasks/:id                 # Actualizar tarea
```

### Estadísticas
```
GET    /api/stats                     # Estadísticas generales
GET    /api/stats/efficiency          # Eficiencia por máquina
```

### Monitoreo
```
GET    /api/monitoring/status         # Estado del monitoreo
POST   /api/monitoring/check          # Forzar chequeo
POST   /api/monitoring/start          # Iniciar monitoreo
POST   /api/monitoring/stop           # Detener monitoreo
```

### Dashboard General
```
GET    /api/dashboard                 # Todos los datos del dashboard
```

---

## ⚙️ Configuración

### Variables de Entorno
```bash
# .env
PORT=3978                    # Puerto bot
DASHBOARD_PORT=3000          # Puerto dashboard
TELEGRAM_BOT_TOKEN=...       # Token Telegram
NODE_ENV=development         # Ambiente
```

### Estructura de Carpetas
```
public/
├── index.html              # Dashboard principal
├── alerts.html             # Página de alertas
├── machines.html           # Página de máquinas
├── tasks.html              # Página de tareas
├── analytics.html          # Página de estadísticas
├── css/
│   └── style.css          # Estilos personalizados
└── js/
    ├── utils.js           # Funciones utilitarias
    ├── dashboard.js       # Lógica dashboard
    ├── alerts.js          # Lógica alertas
    ├── machines.js        # Lógica máquinas
    ├── tasks.js           # Lógica tareas
    └── analytics.js       # Lógica estadísticas
```

### Personalización de CSS
El archivo `public/css/style.css` contiene:
- Variables de colores `:root`
- Estilos de componentes personalizados
- Animaciones y transiciones
- Responsive design

Ejemplo:
```css
:root {
    --primary-color: #0d6efd;
    --success-color: #198754;
    --danger-color: #dc3545;
    /* ... */
}
```

---

## 🎨 Diseño y UX

### Paleta de Colores
| Color | Código | Uso |
|-------|--------|-----|
| Primario | #0d6efd | Buttons, Links |
| Éxito | #198754 | Máquinas activas |
| Peligro | #dc3545 | Alertas críticas |
| Advertencia | #ffc107 | Alertas altas |
| Info | #0dcaf0 | Información general |

### Responsive Design
- Desktop: Layout completo con 2+ columnas
- Tablet: Layout adaptado con 1-2 columnas
- Móvil: Layout single column

### Iconos
Usando Font Awesome 6.0:
- `<i class="fas fa-industry"></i>` - Taller
- `<i class="fas fa-cogs"></i>` - Máquinas
- `<i class="fas fa-tasks"></i>` - Tareas
- `<i class="fas fa-bell"></i>` - Alertas

---

## 🚀 Características Avanzadas

### Auto-Scroll de Alertas
Las alertas se cargan al tope de la lista

### Progreso Visual
Las tareas muestran barras de progreso animadas

### Estados de Máquinas
Colores y iconos indicativos del estado:
- 🟢 Verde = Activa
- 🟡 Amarillo = Mantenimiento

### Time Ago
Fechas relativas:
- "hace 2h"
- "hace 5m"
- "hace 3d"

---

## 📊 Ejemplos de Uso

### Crear una Nueva Tarea

1. Ir a la página de **Tareas** (`/tasks`)
2. Click en botón **"Nueva Tarea"**
3. Completar el formulario:
   - Título
   - Descripción
   - Máquina (select)
   - Fecha de vencimiento
4. Click en **"Crear Tarea"**

### Resolver una Alerta

1. Ir a **Alertas** (`/alerts`)
2. Click en la alerta a resolver
3. Se abre modal con detalles
4. Click en **"Resolver"**
5. Alerta pasa a estado "Resuelta"

### Ver Eficiencia de Máquinas

1. Ir a **Estadísticas** (`/analytics`)
2. Ver gráfico "Eficiencia de Máquinas"
3. Tabla con detalles por máquina
4. Colores indican rendimiento

---

## 🐛 Troubleshooting

### Dashboard no carga
- Verificar que el puerto 3000 esté disponible
- Revisar consola: `npm start`
- Actualizar página en navegador

### Datos no se actualizan
- Verificar conexión de API
- Ver consola del navegador (F12)
- Verificar que el bot está corriendo

### Errores de CORS
- Asegurar que API permite CORS
- Verificar headers en dashboardServer.js
- Probar en navegador privado

---

## 📱 Acceso Móvil

El dashboard es completamente responsive y funciona en:
- Navegadores móviles (Chrome, Safari, Firefox)
- Tablets (iPad, Android)
- Desktops

Para acceso remoto:
```
http://<tu-ip>:3000
```

Donde `<tu-ip>` es la dirección IP de tu servidor.

---

## 🔐 Seguridad

### Consideraciones de Seguridad
- El dashboard NO tiene autenticación por defecto
- Para producción, agregar:
  - Autenticación JWT
  - HTTPS/SSL
  - Rate limiting
  - Validación de entrada

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisar los logs en consola
2. Verificar conexión de API
3. Consultar documentación del bot
4. Reportar en el repositorio del proyecto
