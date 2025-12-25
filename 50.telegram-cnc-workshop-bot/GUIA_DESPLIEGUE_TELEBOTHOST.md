# 🚀 Guía de Despliegue en TelebotHost

**Plataforma:** TelebotHost (https://console.telebothost.com)  
**Dashboard URL:** https://console.telebothost.com/#botdash/11140719  
**Tiempo Estimado:** 30-45 minutos

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en TelebotHost
- ✅ Token del bot de Telegram: `8306836745:AAGzJhTGXz5DG4yR-NO3EySzDcoRlUk3PYc`
- ✅ Código del bot listo (este proyecto)
- ✅ Node.js instalado localmente (para pruebas)

---

## 🔧 Paso 1: Preparación del Código

### 1.1 Verificar Archivos Necesarios

Asegúrate de que existan estos archivos:

```
✅ index.js
✅ bot.js
✅ package.json
✅ Procfile
✅ .env.production (plantilla)
✅ adapters/
✅ services/
✅ dialogs/
✅ data/
✅ public/
```

### 1.2 Verificar package.json

El archivo `package.json` debe tener el script de inicio:

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

✅ Ya está configurado correctamente.

### 1.3 Verificar Procfile

El archivo `Procfile` debe contener:

```
web: node index.js
```

✅ Ya está creado.

---

## 📦 Paso 2: Subir a GitHub (Recomendado)

TelebotHost puede desplegar desde GitHub, lo cual facilita actualizaciones futuras.

### 2.1 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `telegram-cnc-workshop-bot`
3. Visibilidad: Privado (recomendado)
4. Click en "Create repository"

### 2.2 Subir el Código

```bash
cd c:\Users\FELIX\BotBuilder-Samples\50.telegram-cnc-workshop-bot

# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - CNC Workshop Bot"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/telegram-cnc-workshop-bot.git

# Subir código
git push -u origin main
```

**IMPORTANTE:** El archivo `.env` NO se subirá a GitHub porque está en `.gitignore`. Esto es correcto por seguridad.

---

## 🌐 Paso 3: Configurar en TelebotHost

### 3.1 Acceder al Dashboard

1. Ve a: https://console.telebothost.com/#botdash/11140719
2. Inicia sesión con tu cuenta

### 3.2 Crear Nuevo Bot (si no existe)

1. Click en "New Bot" o "Add Bot"
2. Nombre: `CNC Workshop Bot`
3. Tipo: `Node.js`

### 3.3 Conectar con GitHub

**Opción A: Desde GitHub**
1. En TelebotHost, selecciona "Deploy from GitHub"
2. Autoriza TelebotHost a acceder a tu GitHub
3. Selecciona el repositorio `telegram-cnc-workshop-bot`
4. Branch: `main`
5. Click en "Connect"

**Opción B: Subir ZIP**
1. Comprimir la carpeta del proyecto (sin `node_modules`)
2. En TelebotHost, selecciona "Upload ZIP"
3. Sube el archivo ZIP
4. Click en "Deploy"

---

## ⚙️ Paso 4: Configurar Variables de Entorno

En el panel de TelebotHost, ve a la sección "Environment Variables" o "Settings" y agrega:

### Variables Obligatorias:

```env
TELEGRAM_BOT_TOKEN=8306836745:AAGzJhTGXz5DG4yR-NO3EySzDcoRlUk3PYc
NODE_ENV=production
TELEGRAM_USER_ID=7624964937
```

### Variables Opcionales:

```env
DASHBOARD_PORT=3000
MONITORING_INTERVAL=300000
DASHBOARD_URL=https://console.telebothost.com/#botdash/11140719
```

### Variables de Google Sheets (si las usas):

```env
GOOGLE_SPREADSHEET_ID=1qQgazyaUQfNcoLNAxU5a2x9utAQl8zNE5FYMUPxdyQU
GOOGLE_CREDENTIALS_JSON={"type": "service_account", "project_id": "snappy-topic-481406-p9", ...}
```

**NOTA:** El `PORT` NO lo configures manualmente, TelebotHost lo asigna automáticamente.

---

## 🚀 Paso 5: Desplegar

### 5.1 Iniciar Despliegue

1. Click en "Deploy" o "Start Deployment"
2. Espera a que se instalen las dependencias (`npm install`)
3. Espera a que se inicie el bot (`npm start`)

### 5.2 Monitorear el Despliegue

En la consola de TelebotHost verás algo como:

```
[INFO] Installing dependencies...
[INFO] npm install
[INFO] Starting application...
[INFO] node index.js
[SUCCESS] Bot started successfully
==================================================
🏭 CNC Workshop Telegram Bot iniciado
==================================================
📡 Bot Telegram: Puerto 8080
🌐 Dashboard Web: http://localhost:3000
✅ Sistema de alertas: Activo
📡 Monitoreo automático: En ejecución
==================================================
```

### 5.3 Verificar Estado

- ✅ Estado: Running
- ✅ Sin errores en logs
- ✅ Puerto asignado correctamente

---

## 🧪 Paso 6: Probar el Bot

### 6.1 Probar en Telegram

1. Abre Telegram
2. Busca tu bot (el nombre que le diste a @BotFather)
3. Envía `/start`
4. Deberías recibir el mensaje de bienvenida:

```
¡Hola! 👋 Bienvenido al *CNC Workshop Bot*

Soy tu asistente para la gestión del taller CNC...
```

### 6.2 Probar Comandos

Prueba estos comandos:

```
/start
alertas
máquinas
tareas
ayuda
```

### 6.3 Verificar Dashboard

1. En TelebotHost, busca la URL pública de tu aplicación
2. Debería ser algo como: `https://tu-bot.telebothost.com`
3. Abre esa URL en tu navegador
4. Deberías ver el dashboard del taller CNC

---

## 🔍 Paso 7: Verificar Funcionalidades

### 7.1 Sistema de Alertas

- ✅ Las alertas se generan automáticamente cada 5 minutos
- ✅ Puedes verlas con el comando `alertas`
- ✅ Aparecen en el dashboard

### 7.2 Dashboard Web

- ✅ Página principal carga correctamente
- ✅ Gráficos se muestran
- ✅ Navegación entre páginas funciona
- ✅ Auto-refresh cada 5 segundos

### 7.3 Base de Datos

- ✅ Los datos se guardan en archivos JSON
- ✅ Las máquinas se muestran correctamente
- ✅ Las tareas se pueden crear y editar

---

## 🐛 Troubleshooting

### Problema 1: Bot no responde

**Síntomas:** El bot no responde a `/start`

**Soluciones:**
1. Verificar que `TELEGRAM_BOT_TOKEN` esté correcto en las variables de entorno
2. Revisar logs en TelebotHost para errores
3. Verificar que el bot esté "Running" en el dashboard
4. Reiniciar el bot desde TelebotHost

### Problema 2: Error "Cannot find module"

**Síntomas:** Error en logs: `Cannot find module 'express'`

**Soluciones:**
1. Verificar que `package.json` tenga todas las dependencias
2. Forzar reinstalación: En TelebotHost, click en "Rebuild"
3. Verificar que `node_modules` no esté en `.gitignore` (debe estarlo)

### Problema 3: Dashboard no carga

**Síntomas:** Error 404 o página en blanco

**Soluciones:**
1. Verificar que la carpeta `public/` exista y tenga los archivos HTML
2. Verificar que `dashboardServer.js` esté iniciando correctamente
3. Revisar logs para errores de Express
4. Verificar que el puerto del dashboard esté configurado

### Problema 4: Alertas no se envían

**Síntomas:** No llegan notificaciones de alertas

**Soluciones:**
1. Verificar que hayas iniciado conversación con el bot (`/start`)
2. Verificar que `TELEGRAM_USER_ID` esté correcto
3. Revisar logs para errores en `notificationService`
4. Verificar que el monitoreo esté activo

### Problema 5: Datos se pierden al reiniciar

**Síntomas:** Las tareas/máquinas desaparecen después de reiniciar

**Soluciones:**
1. Verificar que la carpeta `data/` tenga permisos de escritura
2. Considerar usar Google Sheets para persistencia
3. Verificar que los archivos JSON se estén guardando correctamente
4. Revisar logs para errores de escritura de archivos

---

## 📊 Monitoreo en Producción

### Logs

Para ver los logs en tiempo real:
1. En TelebotHost, ve a "Logs" o "Console"
2. Filtra por nivel: INFO, ERROR, WARNING
3. Busca errores o advertencias

### Métricas

Monitorea:
- ✅ Uso de CPU
- ✅ Uso de memoria
- ✅ Número de requests
- ✅ Tiempo de respuesta

### Alertas del Sistema

El bot genera alertas automáticamente. Revisa:
- 🔴 Alertas críticas: Acción inmediata
- 🟠 Alertas altas: Revisar pronto
- 🟡 Alertas medias: Revisar en el día
- 🔵 Alertas bajas: Informativas

---

## 🔄 Actualizaciones Futuras

### Método 1: Desde GitHub (Recomendado)

Si conectaste con GitHub:

```bash
# Hacer cambios en el código local
git add .
git commit -m "Descripción de cambios"
git push

# En TelebotHost, click en "Redeploy" o "Pull from GitHub"
```

### Método 2: Subir ZIP

1. Comprimir carpeta actualizada
2. En TelebotHost, "Upload new version"
3. Subir ZIP
4. Click en "Deploy"

---

## 🎯 Checklist de Despliegue

### Pre-Despliegue
- [ ] Código probado localmente
- [ ] `package.json` actualizado
- [ ] `Procfile` creado
- [ ] `.gitignore` configurado
- [ ] Código subido a GitHub (opcional)

### Durante Despliegue
- [ ] Bot creado en TelebotHost
- [ ] Variables de entorno configuradas
- [ ] Código desplegado
- [ ] Instalación de dependencias exitosa
- [ ] Bot iniciado sin errores

### Post-Despliegue
- [ ] Bot responde a `/start`
- [ ] Comandos funcionan correctamente
- [ ] Dashboard accesible
- [ ] Alertas se generan automáticamente
- [ ] Notificaciones llegan a Telegram
- [ ] Logs sin errores críticos

---

## 📞 Información de Soporte

### Recursos del Proyecto
- **Token del Bot:** `8306836745:AAGzJhTGXz5DG4yR-NO3EySzDcoRlUk3PYc`
- **User ID:** `7624964937`
- **Dashboard:** `https://console.telebothost.com/#botdash/11140719`

### Documentación
- `README.md` - Descripción general
- `QUICKSTART.md` - Inicio rápido
- `ALERTS_GUIDE.md` - Guía de alertas
- `DASHBOARD_GUIDE.md` - Guía del dashboard
- `FAQ.md` - Preguntas frecuentes

### Comandos Útiles

```bash
# Ver logs en tiempo real
npm start

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Verificar versión de Node
node -v
```

---

## ✅ Próximos Pasos Después del Despliegue

### Inmediato (Día 1)
1. ✅ Probar todas las funcionalidades
2. ✅ Configurar alertas personalizadas
3. ✅ Agregar máquinas reales
4. ✅ Crear tareas reales
5. ✅ Monitorear logs por 24 horas

### Corto Plazo (Semana 1)
1. ⚡ Optimizar rendimiento
2. ⚡ Ajustar umbrales de alertas
3. ⚡ Personalizar mensajes del bot
4. ⚡ Configurar backups automáticos
5. ⚡ Documentar procesos internos

### Largo Plazo (Mes 1)
1. 🚀 Migrar a base de datos real (MongoDB/PostgreSQL)
2. 🚀 Implementar webhooks en lugar de polling
3. 🚀 Agregar autenticación al dashboard
4. 🚀 Implementar exportación a PDF
5. 🚀 Agregar más tipos de alertas

---

## 🎉 ¡Felicidades!

Tu bot de Telegram está ahora operativo en producción. 

**Recuerda:**
- Monitorear logs regularmente
- Responder a alertas críticas
- Mantener el código actualizado
- Hacer backups periódicos
- Documentar cambios importantes

---

**Última actualización:** 2025-12-24  
**Versión:** 1.0.0  
**Estado:** ✅ LISTO PARA PRODUCCIÓN
