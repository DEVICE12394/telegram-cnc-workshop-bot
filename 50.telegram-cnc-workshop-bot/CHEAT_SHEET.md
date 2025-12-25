# 🎯 Referencia Rápida - Cheat Sheet

Referencia rápida de comandos y funcionalidades principales.

---

## ⚡ Comandos de Terminal

### Instalación y Ejecución
```bash
# Instalar dependencias
npm install

# Ejecutar el sistema completo
npm start

# Ejecutar en modo debug
set NODE_ENV=debug & npm start          # Windows
NODE_ENV=debug npm start                 # Mac/Linux

# Detener el sistema
Ctrl + C

# Limpiar y reinstalar
rm -r node_modules package-lock.json
npm install
```

### Gestión de Procesos
```bash
# Ver puertos en uso (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :3978

# Matar proceso usando puerto (Windows)
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

---

## 🤖 Comandos del Bot Telegram

| Comando | Acción |
|---------|--------|
| `/start` | Menú principal |
| `/status` | Ver estado general |
| `/alerts` | Listar alertas |
| `/tasks` | Gestionar tareas |
| `/machines` | Ver máquinas |
| `/reports` | Generar reportes |
| `/help` | Mostrar ayuda |

---

## 🌐 URLs del Dashboard

| URL | Página |
|-----|--------|
| `http://localhost:3000/` | Dashboard principal |
| `http://localhost:3000/alerts` | Alertas |
| `http://localhost:3000/machines` | Máquinas |
| `http://localhost:3000/tasks` | Tareas |
| `http://localhost:3000/analytics` | Estadísticas |

---

## 📡 API Endpoints Rápidos

### Alertas
```bash
# Listar alertas
curl http://localhost:3000/api/alerts

# Detalle de alerta
curl http://localhost:3000/api/alerts/ALERT-001

# Reconocer alerta
curl -X POST http://localhost:3000/api/alerts/ALERT-001/acknowledge

# Resolver alerta
curl -X POST http://localhost:3000/api/alerts/ALERT-001/resolve
```

### Máquinas
```bash
# Listar máquinas
curl http://localhost:3000/api/machines

# Detalle de máquina
curl http://localhost:3000/api/machines/CNC-01

# Actualizar máquina
curl -X PUT http://localhost:3000/api/machines/CNC-01 \
  -H "Content-Type: application/json" \
  -d '{"eficiencia": 90}'
```

### Tareas
```bash
# Listar tareas
curl http://localhost:3000/api/tasks

# Crear tarea
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi Tarea",
    "maquina": "CNC-01",
    "fechaVencimiento": "2024-01-22"
  }'
```

### Estadísticas
```bash
# Estadísticas generales
curl http://localhost:3000/api/stats

# Eficiencia por máquina
curl http://localhost:3000/api/stats/efficiency

# Dashboard completo
curl http://localhost:3000/api/dashboard
```

---

## 📁 Estructura Rápida de Carpetas

```
RAÍZ
├── bot.js                  ← Lógica bot
├── index.js               ← Punto entrada
├── .env                   ← Configuración
│
├── adapters/
│   └── telegramAdapter.js ← Telegram API
│
├── services/
│   ├── alertManager.js    ← Alertas
│   ├── dashboardServer.js ← API web
│   └── ...
│
├── data/
│   ├── machines.json      ← Máquinas
│   ├── tasks.json         ← Tareas
│   └── alerts/
│       └── alerts.json    ← Historial
│
└── public/
    ├── *.html             ← Páginas
    ├── css/style.css      ← Estilos
    └── js/                ← Lógica frontend
```

---

## 🎨 Atajos de Diseño

### Colores
```
Primario:    #0d6efd (Azul)
Éxito:       #198754 (Verde)
Peligro:     #dc3545 (Rojo)
Advertencia: #ffc107 (Naranja)
Info:        #0dcaf0 (Azul claro)
```

### Emojis Comunes
```
🏭 Taller       🟢 Activa      🚨 Alerta
🔧 Máquina      🟡 Manten.     📊 Datos
📋 Tarea        🔴 Fallo       ✓ Éxito
📈 Gráfico      ⏰ Tiempo       ✕ Error
```

---

## 🔧 Ediciones Comunes

### Cambiar Color Primario
**Archivo:** `public/css/style.css`
```css
:root {
  --primary-color: #tu-color;
}
```

### Cambiar Intervalo de Monitoreo
**Archivo:** `.env`
```env
MONITORING_INTERVAL=600000  # 10 minutos
```

### Cambiar Umbral de Mantenimiento
**Archivo:** `data/alerts/rules.json`
```json
{
  "maintenanceThresholds": {
    "hoursThreshold": 1000,
    "daysThreshold": 180
  }
}
```

### Agregar Nueva Máquina
**Archivo:** `data/machines.json`
```json
{
  "id": "CNC-05",
  "nombre": "Mi Máquina",
  "estado": "activa",
  "eficiencia": 0
}
```

---

## 🔍 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Bot no responde | Ver logs, verificar token |
| Dashboard error | Verificar puerto 3000 |
| No hay alertas | Chequear monitoreo en logs |
| Datos no cargan | Verificar data/machines.json |
| CORS error | Revisar headers en API |
| Puerto en uso | Cambiar en .env o matar proceso |

---

## 📊 Estados y Prioridades

### Estados de Máquina
```
🟢 activa          → Operando normalmente
🟡 mantenimiento   → En servicio o parada
🔴 inactiva        → Fuera de servicio
```

### Estados de Tarea
```
🔵 pendiente       → Esperando inicio
🟠 en-progreso     → En ejecución (0-99%)
🟢 completada      → Finalizada (100%)
⚫ cancelada       → Anulada
```

### Prioridades de Alerta
```
🔴 crítica   → Acción inmediata
🟠 alta      → Resolver hoy
🟡 media     → Planificar
🟢 baja      → Informativo
```

---

## 🔐 Variables de Entorno

```env
# REQUERIDO
TELEGRAM_BOT_TOKEN=...          # Token del bot

# PUERTOS (opcionales)
BOT_PORT=3978                   # Bot
DASHBOARD_PORT=3000             # Dashboard

# AMBIENTE
NODE_ENV=development|production # development

# MONITOREO
MONITORING_INTERVAL=300000      # 5 minutos
ALERT_ARCHIVE_DAYS=30          # Archivo
MAX_ALERTS_MEMORY=1000         # Límite
```

---

## 📊 Formatos de Datos

### Máquina
```json
{
  "id": "CNC-01",
  "nombre": "Centro Maquinado",
  "estado": "activa",
  "eficiencia": 85,
  "horasOperacion": 450
}
```

### Tarea
```json
{
  "id": "TASK-001",
  "titulo": "Fabricar Panel",
  "maquina": "CNC-01",
  "estado": "en-progreso",
  "progreso": 80,
  "prioridad": "alta"
}
```

### Alerta
```json
{
  "id": "ALERT-001",
  "tipo": "maintenance",
  "prioridad": "high",
  "estado": "active",
  "titulo": "Mantenimiento"
}
```

---

## 🎯 Flujos Rápidos

### Crear Tarea
```
Dashboard: Tareas → [+ Nueva] → Completar → [Crear]
Bot: /tasks → Crear tarea → Ingrese datos
```

### Resolver Alerta
```
Dashboard: Alertas → Click alerta → [Resolver]
Bot: /alerts → Seleccionar → Resolver
```

### Registrar Mantenimiento
```
Dashboard: Máquinas → Click máquina → [Registrar Mant.]
Bot: /machines → Seleccionar → Registrar
```

---

## 📞 Archivos de Ayuda

| Archivo | Para qué |
|---------|----------|
| `QUICKSTART.md` | Empezar en 5 minutos |
| `FAQ.md` | Preguntas comunes |
| `CONFIG_REFERENCE.md` | Todas las opciones |
| `ALERTS_GUIDE.md` | Sistema de alertas |
| `DASHBOARD_GUIDE.md` | Dashboard web |
| `PROJECT_SUMMARY.md` | Resumen técnico |

---

## ✅ Checklist de Inicio

```bash
✅ npm install
✅ Editar .env con token
✅ npm start
✅ Bot: buscar en Telegram + /start
✅ Dashboard: http://localhost:3000
```

---

## 🚀 Comandos Más Usados

```bash
# Instalar
npm install

# Ejecutar
npm start

# Acceder
# Bot: Telegram
# Dashboard: http://localhost:3000

# Parar
Ctrl + C

# Debugear
npm start (ver logs)
F12 en navegador (errores frontend)
```

---

## 📋 Referencia de Archivos

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| bot.js | 300+ | Conversación |
| services/*.js | 2000+ | Lógica |
| public/*.html | 500+ | UI |
| public/js/*.js | 700+ | Frontend logic |
| public/css/style.css | 600+ | Estilos |

---

## 🎓 Conceptos Clave

```
BOT FRAMEWORK     → Conversación con usuarios
REST API         → Comunicación cliente-servidor
JSON             → Almacenamiento de datos
CHART.JS         → Visualización de datos
BOOTSTRAP        → Interfaz responsive
WEBHOOK          → Telegram → Tu servidor
POLLING          → Dashboard pregunta cada 5s
```

---

**Guarda este archivo como referencia rápida. ¡Que disfrutes!** 🚀

---

**Última actualización:** 2024-01-20  
**Versión:** 1.0.0
