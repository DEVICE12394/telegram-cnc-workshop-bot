# ⚡ Inicio Rápido - Dashboard & Bot

Guía rápida para instalar y ejecutar el bot de Telegram con dashboard web.

## 🚀 Setup Inicial (5 minutos)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:

```env
# Bot Telegram
TELEGRAM_BOT_TOKEN=tu_token_aqui
BOT_PORT=3978

# Dashboard
DASHBOARD_PORT=3000

# Ambiente
NODE_ENV=development
```

**Obtener Token:**
- Hablar con [@BotFather](https://t.me/botfather) en Telegram
- Crear bot nuevo
- Copiar el token

### 3. Ejecutar el Sistema

```bash
npm start
```

**Salida esperada:**
```
🤖 CNC Workshop Bot iniciado
🌐 Dashboard disponible en: http://localhost:3000
📞 Bot escuchando en puerto: 3978
```

---

## 🎯 Primeros Pasos

### En el Bot de Telegram

1. Buscar tu bot en Telegram
2. Click en `/start`
3. El bot mostrará el menú principal:
   ```
   👋 ¡Bienvenido al Bot CNC Workshop!
   
   ¿Qué deseas hacer?
   📊 Estado General
   🚨 Alertas
   📋 Tareas
   🔧 Máquinas
   📈 Reportes
   ```

4. Seleccionar una opción del menú

### En el Dashboard

1. Abrir navegador: `http://localhost:3000`
2. Verás 5 secciones principales:
   - 📊 **Dashboard** - Vista general
   - 🚨 **Alertas** - Sistema de alertas
   - 🔧 **Máquinas** - Estado de máquinas
   - 📋 **Tareas** - Gestión de tareas
   - 📈 **Estadísticas** - Análisis

---

## 📊 Datos de Prueba

El sistema viene con datos de ejemplo:

### Máquinas
- **CNC-01**: Activa, Eficiencia 85%
- **CNC-02**: Activa, Eficiencia 92%
- **CNC-03**: Mantenimiento, Eficiencia 0%
- **CNC-04**: Activa, Eficiencia 78%

### Tareas
- **Fabricar Panel Aluminio** - CNC-01 (80% completada)
- **Corte de Acero** - CNC-02 (45% completada)

### Alertas
Se generan automáticamente cada 5 minutos según:
- Horas de funcionamiento de máquinas
- Vencimiento de tareas
- Estado de máquinas

---

## 🎮 Operaciones Comunes

### Crear una Tarea

**Bot:**
```
/tasks
→ Seleccionar "Crear tarea"
→ Ingrese datos
```

**Dashboard:**
```
Ir a Tareas → Botón "Nueva Tarea" → Completar formulario
```

### Registrar Mantenimiento

**Bot:**
```
/machines
→ Seleccionar máquina
→ "Registrar mantenimiento"
```

**Dashboard:**
```
Ir a Máquinas → Click en máquina → Botón "Mantenimiento"
```

### Ver Alertas Activas

**Bot:**
```
/alerts
→ Ver lista de alertas activas
```

**Dashboard:**
```
Ir a Alertas → Filtrar por "Activas"
```

---

## 🔔 Sistema de Alertas Automático

El sistema crea alertas automáticamente cada 5 minutos:

### Tipos de Alertas

| Tipo | Condición | Prioridad |
|------|-----------|-----------|
| Mantenimiento | >500h sin servicio | Alta |
| Fallo | >30min sin respuesta | Crítica |
| Tarea Vencida | <24h para deadline | Alta |
| Downtime | >4h sin operación | Media |
| Producción | Déficit >20% | Media |
| Stock Bajo | <10 items | Baja |
| Error | Fallo del sistema | Crítica |

---

## 📈 Monitoreo en Tiempo Real

### Dashboard
- Auto-actualización cada 5 segundos
- Gráficos interactivos
- Alertas visuales

### Bot
- Notificaciones de nuevas alertas
- Resúmenes cada hora
- Alertas críticas inmediatas

---

## 🔍 Troubleshooting

### El bot no responde
```bash
# Verificar token correcto en .env
# Reiniciar:
npm start

# Ver logs:
npm run dev  # Modo debug
```

### Dashboard muestra "error"
```bash
# Verificar puerto 3000 disponible
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux

# Si está ocupado, cambiar DASHBOARD_PORT en .env
```

### No llegan notificaciones a Telegram
- Verificar que hablaste con el bot primero (`/start`)
- Verificar token válido
- Revisar conectividad de internet

---

## 📁 Estructura del Proyecto

```
project/
├── bot.js                    # Lógica del bot
├── index.js                  # Punto de entrada
├── .env                      # Variables de ambiente
├── package.json              # Dependencias
├── adapters/
│   └── telegramAdapter.js   # Integración Telegram
├── services/
│   ├── alertManager.js      # Gestión de alertas
│   ├── notificationService.js
│   ├── monitoringService.js
│   ├── dashboardServer.js   # Servidor web
│   ├── reportManager.js
│   └── workshopDatabase.js
├── dialogs/
│   └── dialogHelper.js
├── data/
│   ├── machines.json        # Datos de máquinas
│   ├── tasks.json           # Datos de tareas
│   └── alerts/
│       ├── alerts.json      # Alertas
│       └── rules.json       # Reglas
└── public/                  # Frontend
    ├── index.html
    ├── alerts.html
    ├── machines.html
    ├── tasks.html
    ├── analytics.html
    ├── css/
    │   └── style.css
    └── js/
        ├── utils.js
        ├── dashboard.js
        ├── alerts.js
        ├── machines.js
        ├── tasks.js
        └── analytics.js
```

---

## 🚀 Próximos Pasos

### Recomendado
1. ✅ Ejecutar el sistema
2. ✅ Hablar con el bot en Telegram
3. ✅ Acceder al dashboard en navegador
4. ✅ Crear una tarea de prueba
5. ✅ Ver alertas generadas automáticamente

### Opcional (Mejoras)
- [ ] Agregar autenticación al dashboard
- [ ] Conectar a base de datos MongoDB
- [ ] Agregar notificaciones por email
- [ ] Exportar reportes en PDF
- [ ] Implementar WebSockets para actualizaciones en tiempo real

---

## 💡 Tips

### Performance
- Para muchos datos, considerar MongoDB
- WebSockets más eficientes que polling
- Cachear datos frecuentes

### Seguridad
- Nunca compartir el token del bot
- Usar HTTPS en producción
- Agregar autenticación al dashboard
- Validar todas las entradas

### Debugging
```bash
# Ver logs en tiempo real
npm start

# Usar modo debug
set NODE_ENV=debug & npm start  # Windows
NODE_ENV=debug npm start         # Mac/Linux
```

---

## 📞 Comandos Útiles

### Bot
```
/start           - Menú principal
/status          - Estado general
/alerts          - Ver alertas
/tasks           - Gestionar tareas
/machines        - Ver máquinas
/reports         - Generar reportes
/help            - Ayuda
```

### NPM
```bash
npm start        - Ejecutar sistema
npm install      - Instalar dependencias
npm stop         - Detener
npm run dev      - Modo desarrollo
```

---

## ✅ Checklist de Setup

- [ ] Node.js instalado (`node -v` >= 14)
- [ ] Git clonado/descargado
- [ ] `npm install` completado
- [ ] `.env` configurado con token
- [ ] `npm start` ejecutado sin errores
- [ ] Bot respondiendo en Telegram
- [ ] Dashboard cargando en `localhost:3000`

---

## 🎓 Documentación Completa

Para información detallada, ver:
- **Bot**: Revisar `bot.js` y comentarios
- **Alertas**: Leer `ALERTS_GUIDE.md`
- **Dashboard**: Leer `DASHBOARD_GUIDE.md`
- **API**: Ver endpoints en `dashboardServer.js`

---

¡Listo! Tu sistema CNC Workshop Bot está operacional. 🚀
