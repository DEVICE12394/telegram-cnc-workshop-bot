# CNC Workshop Telegram Bot

Un bot conversacional de Telegram para la gestión integral de un taller CNC (fresadoras, tornos, etc.).

## 🎯 Características

- **Generación de Reportes**: Reportes de producción, máquinas, tiempo de inactividad y reportes completos
- **Importación de Datos**: Importar reportes en formato CSV, Excel o JSON
- **Monitoreo de Máquinas**: Ver estado en tiempo real de todas las máquinas CNC
- **Gestión de Tareas**: Crear, asignar y dar seguimiento a tareas de producción
- **🚨 Sistema de Alertas**: Alertas en tiempo real con múltiples tipos y niveles de prioridad
- **Estadísticas**: Análisis de eficiencia y desempeño del taller
- **Interfaz Conversacional**: Bot amigable y fácil de usar

## 🚀 Inicio Rápido

### Requisitos
- Node.js 14+
- Token de bot de Telegram

### Instalación

1. Clona el repositorio (si aún no lo has hecho):
```bash
git clone https://github.com/Microsoft/BotBuilder-Samples.git
cd BotBuilder-Samples
```

2. Navega a la carpeta del bot:
```bash
cd samples/javascript_nodejs/50.telegram-cnc-workshop-bot
```

3. Instala las dependencias:
```bash
npm install
```

4. Configura el archivo `.env`:
```bash
# .env
TELEGRAM_BOT_TOKEN=tu_token_aqui
NODE_ENV=development
PORT=3978
```

5. Inicia el bot:
```bash
npm start
```

Para desarrollo con recargas automáticas:
```bash
npm run dev
```

## 📖 Uso

### Comandos Principales

| Comando | Descripción |
|---------|-------------|
| `/start` | Muestra el menú principal |
| `reportes` | Accede al generador de reportes |
| `alertas` | Ver alertas activas del sistema |
| `máquinas` | Ver estado de máquinas CNC |
| `tareas` | Gestionar tareas y trabajos |
| `estadísticas` | Ver estadísticas del taller |
| `ayuda` | Mostrar guía de uso |

### Ejemplos de Uso

**Ver máquinas disponibles:**
```
Usuario: máquinas
Bot: 🔧 Estado de Máquinas...
```

**Ver alertas activas:**
```
Usuario: alertas
Bot: 🚨 Sistema de Alertas
    🔴 Críticas: 1
    ⚠️ Altas: 2
    ...
```

**Generar reporte:**
```
Usuario: generar reporte
Bot: 📊 Generador de Reportes...
```

**Crear tarea:**
```
Usuario: nueva tarea
Bot: Cuéntame sobre la tarea...
```

## 📂 Estructura del Proyecto

```
50.telegram-cnc-workshop-bot/
├── index.js                 # Entrada principal
├── bot.js                   # Lógica principal del bot
├── .env                     # Variables de entorno
├── package.json             # Dependencias
├── README.md                # Este archivo
├── ALERTS_GUIDE.md          # Guía completa de alertas
├── config.example.js        # Ejemplo de configuración
├── adapters/
│   └── telegramAdapter.js   # Adaptador de Telegram
├── services/
│   ├── reportManager.js     # Gestión de reportes
│   ├── workshopDatabase.js  # Base de datos del taller
│   ├── alertManager.js      # Gestor de alertas 🚨
│   ├── notificationService.js # Notificaciones por Telegram
│   └── monitoringService.js # Monitoreo automático
├── dialogs/
│   └── dialogHelper.js      # Utilidades de diálogos
└── data/                    # Almacenamiento de datos
    ├── reports/             # Reportes generados
    ├── alerts/              # Alertas y configuración
    │   ├── alerts.json
    │   └── rules.json
    ├── machines.json        # Datos de máquinas
    ├── tasks.json           # Tareas del taller
    └── users.json           # Usuarios registrados
```

## 🔌 Dependencias Principales

- **botbuilder**: Marco de trabajo de bots de Microsoft
- **botbuilder-dialogs**: Sistema de diálogos conversacionales
- **node-telegram-bot-api**: API de Telegram
- **dotenv**: Gestión de variables de entorno
- **axios**: Cliente HTTP para API calls

## 💾 Gestión de Datos

### Máquinas
Las máquinas CNC se almacenan en `data/machines.json`:
```json
{
  "id": "CNC-01",
  "name": "Torno CNC-01",
  "type": "Torno",
  "status": "activa",
  "hoursOfOperation": 2456
}
```

### Tareas
Las tareas se almacenan en `data/tasks.json`:
```json
{
  "id": "TASK-001",
  "title": "Fabricación de piezas",
  "machine": "CNC-01",
  "status": "en progreso",
  "progress": 65
}
```

### Reportes
Los reportes generados se guardan en `data/reports/`:
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "type": "production",
  "title": "Reporte de Producción Diaria",
  "data": { ... }
}
```

## 🚀 Próximas Características

- [ ] Integración con base de datos (MongoDB/PostgreSQL)
- [ ] Gráficos y visualizaciones de reportes
- [ ] Notificaciones por email y SMS
- [ ] Exportación a PDF
- [ ] Autenticación de usuarios
- [ ] Historial completo de eventos
- [ ] API REST para integración externa
- [ ] Dashboard web
- [ ] Escalamiento automático de alertas
- [ ] Rutinas automáticas de resolución

## 🐛 Troubleshooting

### El bot no responde
- Verifica que el `TELEGRAM_BOT_TOKEN` sea correcto
- Confirma que tienes conexión a internet
- Revisa los logs en la consola

### Error de "Token inválido"
- Genera un nuevo token con [@BotFather](https://t.me/botfather)
- Actualiza el archivo `.env`

### Los datos no se guardan
- Verifica permisos de carpeta en `data/`
- Asegúrate de que la carpeta existe
- Comprueba permisos de escritura

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio.

---

**Creado con ❤️ para optimizar la gestión de talleres CNC**

---

## 🚨 Sistema de Alertas

Para documentación completa sobre el sistema de alertas, alertas automáticas, notificaciones y monitoreo:

👉 **[Consulta ALERTS_GUIDE.md](./ALERTS_GUIDE.md)**

El sistema incluye:
- ✅ 7 tipos diferentes de alertas
- ✅ 4 niveles de prioridad
- ✅ Monitoreo automático cada 5 minutos
- ✅ Notificaciones en tiempo real
- ✅ Gestión de alertas (reconocer, resolver)
- ✅ Estadísticas y reportes de alertas
