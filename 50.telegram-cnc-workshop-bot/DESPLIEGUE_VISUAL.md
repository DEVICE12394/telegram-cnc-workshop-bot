# 🎯 GUÍA VISUAL DE DESPLIEGUE - PASO A PASO

**Bot:** @pennyworthDEVICE_bot (ID: 11140719)  
**Estado Actual:** Activo (2.5 horas de uptime)  
**Archivo ZIP Creado:** `c:\Users\FELIX\BotBuilder-Samples\telegram-cnc-bot-deploy.zip` ✅

---

## ✅ LO QUE YA ESTÁ HECHO

- ✅ Dependencias instaladas (`npm install`)
- ✅ Archivo ZIP creado y listo para subir
- ✅ Bot token ya configurado en TelebotHost: `8306836745:AAGzJh...`
- ✅ Bot activo y funcionando

---

## 🚀 PASOS PARA COMPLETAR EL DESPLIEGUE

### PASO 1: Configurar Variables de Entorno ⚙️

1. **Abre TelebotHost:** https://console.telebothost.com/#botdash/11140719
2. **Click en la pestaña "Env"** (Environment Variables)
3. **Agrega las siguientes variables:**

```
TELEGRAM_USER_ID=7624964937
NODE_ENV=production
DASHBOARD_PORT=3000
```

**Cómo agregar cada variable:**
- Click en el botón "+" o "Add Variable"
- Nombre: `TELEGRAM_USER_ID`
- Valor: `7624964937`
- Click "Save" o "Add"
- Repetir para las otras variables

---

### PASO 2: Subir el Código 📦

**Opción A: Usar la pestaña "Tool"**

1. **Click en la pestaña "Tool"**
2. Busca la opción "Upload File" o "Update Code"
3. **Selecciona el archivo:** `c:\Users\FELIX\BotBuilder-Samples\telegram-cnc-bot-deploy.zip`
4. Click "Upload" o "Deploy"

**Opción B: Usar la pestaña "Settings"**

1. **Click en la pestaña "Settings"**
2. Busca la sección "Code" o "Files"
3. **Selecciona el archivo:** `c:\Users\FELIX\BotBuilder-Samples\telegram-cnc-bot-deploy.zip`
4. Click "Upload" o "Update"

---

### PASO 3: Reiniciar el Bot 🔄

Después de subir el código:

1. **Click en "Stop Bot"** (si está corriendo)
2. Espera 5 segundos
3. **Click en "Start Bot"**
4. Monitorea la pestaña "Errors" para ver los logs

---

### PASO 4: Verificar el Despliegue ✅

**En la pestaña "Errors" (Logs) deberías ver:**

```
==================================================
🏭 CNC Workshop Telegram Bot iniciado
==================================================
📡 Bot Telegram: Puerto XXXX
🌐 Dashboard Web: http://localhost:3000
✅ Sistema de alertas: Activo
📡 Monitoreo automático: En ejecución
==================================================
```

---

### PASO 5: Probar el Bot en Telegram 📱

1. **Abre Telegram**
2. **Busca:** `@pennyworthDEVICE_bot`
3. **Envía:** `/start`
4. **Deberías recibir:**

```
¡Hola! 👋 Bienvenido al *CNC Workshop Bot*

Soy tu asistente para la gestión del taller CNC...
```

5. **Prueba comandos:**
   - `alertas`
   - `máquinas`
   - `tareas`
   - `ayuda`

---

## 📊 INFORMACIÓN DEL DASHBOARD

**Lo que vi en tu dashboard:**

- ✅ **Bot Status:** Active
- ✅ **Uptime:** ~2.5 hours
- ✅ **Total Users:** 2
- ✅ **Bot Username:** @pennyworthDEVICE_bot
- ✅ **Bot ID:** 11140719
- ✅ **Token:** Ya configurado (8306836745:AAGzJh...)

**Pestañas disponibles:**
1. **Dash** - Vista principal con estadísticas
2. **Settings** - Configuración del bot (nombre, token, foto)
3. **Env** - Variables de entorno ⭐ **USAR ESTA**
4. **Tool** - Herramientas y subida de archivos ⭐ **USAR ESTA**
5. **Errors** - Logs y errores del bot

---

## 🔑 VARIABLES DE ENTORNO REQUERIDAS

Copia y pega estas en la pestaña "Env":

```
Nombre: TELEGRAM_USER_ID
Valor: 7624964937

Nombre: NODE_ENV
Valor: production

Nombre: DASHBOARD_PORT
Valor: 3000
```

**NOTA:** El token `TELEGRAM_BOT_TOKEN` ya está configurado en Settings, no necesitas agregarlo en Env.

---

## 📁 UBICACIÓN DEL ARCHIVO ZIP

El archivo está listo en:
```
c:\Users\FELIX\BotBuilder-Samples\telegram-cnc-bot-deploy.zip
```

**Contenido del ZIP:**
- ✅ `index.js` - Punto de entrada
- ✅ `bot.js` - Lógica del bot
- ✅ `package.json` - Dependencias
- ✅ `Procfile` - Configuración de despliegue
- ✅ `adapters/` - Adaptador de Telegram
- ✅ `services/` - Servicios del bot
- ✅ `dialogs/` - Helpers de diálogos
- ✅ `data/` - Datos de máquinas y tareas
- ✅ `public/` - Dashboard web
- ❌ `node_modules/` - NO incluido (se instala automáticamente)

---

## ⚠️ PROBLEMAS COMUNES

### Si el bot no responde después de desplegar:

1. **Verifica las variables de entorno** en la pestaña "Env"
2. **Revisa los logs** en la pestaña "Errors"
3. **Reinicia el bot** (Stop → Start)
4. **Verifica que el archivo ZIP se subió correctamente**

### Si ves errores en los logs:

- **"Cannot find module"** → El ZIP no se subió correctamente, vuelve a subirlo
- **"Token inválido"** → Verifica el token en Settings
- **"Port already in use"** → Reinicia el bot

---

## ✅ CHECKLIST FINAL

Antes de probar el bot, verifica:

- [ ] Variables de entorno agregadas en pestaña "Env"
  - [ ] `TELEGRAM_USER_ID=7624964937`
  - [ ] `NODE_ENV=production`
  - [ ] `DASHBOARD_PORT=3000`
- [ ] Archivo ZIP subido en pestaña "Tool"
- [ ] Bot reiniciado (Stop → Start)
- [ ] Logs muestran mensaje de inicio exitoso
- [ ] Bot responde a `/start` en Telegram

---

## 🎉 DESPUÉS DEL DESPLIEGUE

Una vez que el bot esté funcionando:

### Inmediato:
- ✅ Enviar `/start` y verificar respuesta
- ✅ Probar comandos básicos
- ✅ Verificar que las alertas se generen
- ✅ Monitorear logs por 1 hora

### Próximas 24 horas:
- ⚡ Verificar estabilidad del bot
- ⚡ Probar todas las funcionalidades
- ⚡ Ajustar configuraciones si es necesario
- ⚡ Documentar cualquier problema

---

## 📞 INFORMACIÓN DE CONTACTO

**Dashboard TelebotHost:**
https://console.telebothost.com/#botdash/11140719

**Bot en Telegram:**
@pennyworthDEVICE_bot

**Archivo ZIP:**
`c:\Users\FELIX\BotBuilder-Samples\telegram-cnc-bot-deploy.zip`

---

## 🚀 RESUMEN

1. ✅ **Código preparado** - ZIP creado
2. ⏳ **Configurar Env** - Agregar 3 variables
3. ⏳ **Subir ZIP** - En pestaña Tool
4. ⏳ **Reiniciar bot** - Stop → Start
5. ⏳ **Probar** - Enviar `/start`

**Tiempo estimado:** 10-15 minutos

---

**¡Tu bot está listo para el despliegue final! 🎉**

---

**Última actualización:** 2025-12-24 23:03  
**Estado:** Archivo ZIP creado, listo para subir  
**Próximo paso:** Configurar variables de entorno en TelebotHost
