# ❓ FAQ - Preguntas Frecuentes

Respuestas a las preguntas más comunes sobre el sistema CNC Workshop Bot.

---

## 🚀 Instalación y Setup

### P: ¿Qué versión de Node.js necesito?
**R:** Node.js 14 o superior. Verificar con:
```bash
node --version
```

### P: ¿Cómo obtengo el token de Telegram?
**R:** 
1. Abre Telegram
2. Busca `@BotFather`
3. Envía `/newbot`
4. Sigue las instrucciones
5. Copia el token en `.env`

### P: ¿Puedo ejecutar el bot y el dashboard en diferentes puertos?
**R:** Sí, editar `.env`:
```env
BOT_PORT=3978
DASHBOARD_PORT=3000
```
Cada uno puede estar en puerto diferente e incluso en servidores diferentes.

### P: ¿Es necesario tener internet siempre?
**R:** Sí, el bot necesita conectarse a Telegram. El dashboard también necesita conectarse al bot.

### P: ¿Cuántas máquinas puedo registrar?
**R:** Teoricamente ilimitado. En la práctica, con JSON recomendamos <100 máquinas. Para más, migrar a MongoDB.

---

## 🤖 Bot de Telegram

### P: El bot no responde a /start
**R:** Verificar:
1. Token válido en `.env`
2. Bot ejecutándose: `npm start`
3. Puerto 3978 disponible
4. Hablaste con el bot al menos una vez
5. Revisar logs en consola

### P: ¿Por qué no recibo notificaciones de alertas?
**R:** Asegúrate de:
1. Haber hablado con el bot (`/start`)
2. El monitoreo está habilitado
3. Existen condiciones que cumplen alertas
4. Token correcto
5. Conexión de internet activa

### P: ¿Cómo registro nuevas máquinas desde el bot?
**R:** Actualmente se registran editando `data/machines.json`. En el futuro se agregará comando en el bot.

### P: ¿El bot puede manejar múltiples usuarios simultáneamente?
**R:** Sí, está diseñado para múltiples usuarios. Cada usuario ve sus datos independientemente.

---

## 📊 Dashboard Web

### P: El dashboard muestra "Error conectando a API"
**R:** Verificar:
1. Bot ejecutándose (`npm start`)
2. Puerto 3000 disponible: `netstat -ano | findstr :3000`
3. Consola del navegador para más detalles (F12)
4. Firewall no bloquea puerto 3000

### P: Los datos no se actualizan en tiempo real
**R:** El dashboard se actualiza cada 5 segundos. Si necesitas más:
- Cambiar en `public/js/utils.js`: `AUTO_REFRESH_INTERVAL`
- Para tiempo real, implementar WebSockets (v1.5)

### P: ¿El dashboard funciona en móvil?
**R:** Sí, es completamente responsivo. Acceder desde móvil:
```
http://<tu-ip>:3000
```
Donde `<tu-ip>` es la dirección IP de tu servidor.

### P: ¿Por qué los gráficos están vacíos?
**R:** 
1. Verificar datos en `data/machines.json`
2. Crear algunas máquinas de prueba
3. Ver consola (F12) para errores
4. Esperar 5 segundos a que se carguen

### P: ¿Puedo cambiar los colores del dashboard?
**R:** Sí, editar `public/css/style.css`:
```css
:root {
  --primary-color: #tu-color;
  --success-color: #tu-color;
  /* ... */
}
```

---

## 🚨 Sistema de Alertas

### P: No aparecen alertas automáticas
**R:** Verificar:
1. Monitoreo habilitado y ejecutándose
2. Condiciones cumplen umbrales (ver `data/alerts/rules.json`)
3. Máquinas con horas >500 o días >90
4. Tareas con vencimiento <24h
5. Revisar logs: `npm start`

### P: Recibo demasiadas alertas duplicadas
**R:** El sistema evita duplicados automáticamente. Si aún ocurre:
1. Revisar `alertManager.js` método `isDuplicate()`
2. Aumentar ventana de deduplicación
3. Limitar tipos de alertas en `rules.json`

### P: ¿Puedo crear tipos de alertas personalizados?
**R:** Sí, editar `services/alertManager.js`:
```javascript
const ALERT_TYPES = {
  mi_alerta: 'mi_alerta',
  // ...
};
```

### P: Las alertas resueltas desaparecen muy rápido
**R:** Configurar en `.env`:
```env
ALERT_ARCHIVE_DAYS=30  # Archivan después de 30 días
```

---

## 🔧 Máquinas

### P: ¿Cómo agrego una nueva máquina?
**R:** Editar `data/machines.json`:
```json
{
  "id": "CNC-05",
  "nombre": "Mi Máquina",
  "estado": "activa",
  "eficiencia": 85,
  "horasOperacion": 100,
  // ...
}
```

### P: ¿Qué significan los estados de máquina?
**R:**
- 🟢 **Activa**: Operando normalmente
- 🟡 **Mantenimiento**: En servicio o parada
- 🔴 **Inactiva**: Fuera de servicio

### P: La eficiencia de mi máquina es 0%
**R:** Se calcula por tareas completadas. Crear tareas y marcarlas completadas.

### P: ¿Puedo cambiar los umbrales de mantenimiento?
**R:** Sí, editar `data/alerts/rules.json`:
```json
{
  "maintenanceThresholds": {
    "hoursThreshold": 500,
    "daysThreshold": 90
  }
}
```

---

## 📋 Tareas

### P: ¿Cómo creo una tarea?
**R:** 
1. Dashboard: Ir a Tareas → "Nueva Tarea"
2. Bot: Seleccionar "Tareas" del menú

### P: Una tarea está atrasada/vencida
**R:** Se generará una alerta automáticamente. En el dashboard verás indicador 🔴.

### P: ¿Puedo asignar una tarea a una persona específica?
**R:** Actualmente el sistema es simple. En futuras versiones agregaremos sistema de usuarios.

### P: ¿Cuántas tareas puede manejar una máquina?
**R:** Ilimitado teóricamente. Se puede asignar múltiples simultáneamente.

---

## 💾 Datos y Persistencia

### P: ¿Dónde se guardan los datos?
**R:** En archivos JSON dentro de carpeta `data/`:
```
data/
├── machines.json
├── tasks.json
├── users.json
└── alerts/
    ├── alerts.json
    └── rules.json
```

### P: ¿Cómo hago backup de datos?
**R:** Copiar carpeta `data/`:
```bash
# Windows
xcopy data data_backup /E /I

# Mac/Linux
cp -r data data_backup
```

### P: Perdí los datos, ¿cómo los recupero?
**R:** 
1. Si hiciste backup: restaurar desde copia
2. Si no hay backup: revisar tu sistema de archivos para recuperación
3. Para futuro: configurar backups automáticos

### P: ¿Puedo usar una base de datos real (MongoDB)?
**R:** No en v1.0, pero está en roadmap para v1.5. Mirar `CONFIG_REFERENCE.md` para detalles.

---

## 🔐 Seguridad

### P: ¿Es seguro que cualquiera acceda al dashboard?
**R:** No. Para producción, agregar autenticación:
- JWT tokens
- Username/password
- OAuth
Ver `CONFIG_REFERENCE.md` para detalles.

### P: ¿Cómo protejo el token del bot?
**R:** 
1. Nunca compartirlo públicamente
2. Usar `.env` (no versionarlo)
3. Regenerar si se filtra
4. En servidores, usar variables de ambiente

### P: ¿Mi servidor es vulnerable a ataques?
**R:** Medidas básicas implementadas:
- CORS headers
- Error handling
- Validación de entrada
Para producción, agregar más seguridad (ver `CONFIG_REFERENCE.md`).

---

## 🔧 Troubleshooting Avanzado

### P: Puerto 3000/3978 ya está en uso
**R:**
```bash
# Encontrar proceso usando puerto 3000
netstat -ano | findstr :3000

# Matar proceso (Windows)
taskkill /PID <PID> /F

# O cambiar puerto en .env
DASHBOARD_PORT=8000
BOT_PORT=8080
```

### P: "Cannot find module" error
**R:**
```bash
# Reinstalar dependencias
rm -r node_modules package-lock.json
npm install
```

### P: Errores de permisos en carpeta data/
**R:**
```bash
# Cambiar permisos (Linux/Mac)
chmod -R 755 data/

# Windows: Click derecho → Properties → Security → Edit
```

### P: Bot se cae frecuentemente
**R:** Verificar:
1. Logs: revisar errores en consola
2. Memoria: `node --max-old-space-size=4096 index.js`
3. Limpieza: aumentar `ALERT_ARCHIVE_DAYS`
4. Usar PM2 para mantenerlo vivo:
```bash
npm install -g pm2
pm2 start index.js --name "cnc-bot"
pm2 save
pm2 startup
```

### P: API lenta o timeouts
**R:**
1. Aumentar timeout en `CONFIG_REFERENCE.md`
2. Optimizar queries si usan MongoDB
3. Agregar caché
4. Revisar uso de CPU/memoria

---

## 📞 Performance

### P: ¿Cuántos usuarios simultáneos soporta?
**R:** Con JSON: ~20-50 usuarios. Con MongoDB: 1000+. Depende del servidor.

### P: Los gráficos se cargan lento
**R:** 
1. Reducir auto-refresh interval (cuidado con CPU)
2. Usar menos máquinas en vista
3. Implementar paginación
4. Migrar a WebSockets

### P: Mucho consumo de memoria
**R:**
1. Limpiar alertas viejas: modificar `ALERT_ARCHIVE_DAYS`
2. Limitar historial: implementar rotación de logs
3. Usar clustering: `pm2 -i max`

---

## 🌍 Deployment

### P: ¿Puedo hostear en la nube?
**R:** Sí, compatible con:
- **Heroku**: Configurar Procfile
- **AWS**: EC2 o Lambda
- **Google Cloud**: App Engine
- **DigitalOcean**: Droplet
- **VPS local**: Configurar port forwarding

### P: ¿Necesito certificado SSL?
**R:** Recomendado para producción. Usar Let's Encrypt (gratis):
```bash
certbot certonly --standalone -d midominio.com
```

### P: ¿Cómo hago acceso remoto al dashboard?
**R:** 
1. Port forwarding en router
2. VPN
3. Tunneling (ngrok)
4. Hosting en servidor público

---

## 🆘 Contacto y Soporte

### P: Encontré un bug, ¿dónde reporto?
**R:** 
1. Revisar documentación en `/` folder
2. Buscar en este FAQ
3. Revisar logs: `npm start`
4. Reportar en repositorio del proyecto

### P: Tengo una sugerencia de feature
**R:** Abrir issue en repositorio con:
- Descripción clara
- Caso de uso
- Ejemplo esperado
- Prioridad sugerida

### P: ¿Hay comunidad o foro?
**R:** Comunidad todavía pequeña. Contactar directamente o revisar documentación en proyecto.

---

## 📚 Recursos Adicionales

### Documentación
- **QUICKSTART.md** - Inicio rápido
- **ALERTS_GUIDE.md** - Sistema de alertas
- **DASHBOARD_GUIDE.md** - Dashboard web
- **CONFIG_REFERENCE.md** - Referencia de configuración
- **PROJECT_SUMMARY.md** - Resumen completo

### Tutoriales Externos
- [Microsoft Bot Framework](https://dev.botframework.com/)
- [Telegram Bot API](https://core.telegram.org/bots)
- [Express.js](https://expressjs.com/)
- [Chart.js](https://www.chartjs.org/)
- [Bootstrap 5](https://getbootstrap.com/)

### Herramientas Útiles
- **Postman**: Testear API endpoints
- **Git**: Control de versiones
- **Docker**: Containerizar aplicación
- **PM2**: Gestión de procesos Node.js
- **Studio 3T**: Administrar MongoDB

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verificar:

- [ ] Node.js versión 14+
- [ ] Dependencias instaladas (`npm install`)
- [ ] `.env` configurado correctamente
- [ ] Puertos 3978 y 3000 disponibles
- [ ] Token de Telegram válido
- [ ] Carpeta `data/` con permisos de lectura/escritura
- [ ] Ningún error en consola de Node.js
- [ ] Navegador sin errores (F12)
- [ ] Conectado a internet

Si todo está correcto y aún hay problemas, revisar los logs detalladamente.

---

## 🎓 Aprendizaje

### Conceptos Clave
1. **Bot Framework**: Conversación con usuarios
2. **REST API**: Comunicación cliente-servidor
3. **WebSocket**: Comunicación en tiempo real (futuro)
4. **JSON**: Persistencia de datos
5. **Chart.js**: Visualización de datos

### Próximos Pasos
1. Personalizar el sistema para tu taller
2. Agregar máquinas reales
3. Testear con datos de producción
4. Implementar autenticación
5. Migrar a base de datos real

---

**¿Tienes más preguntas?** Revisar la documentación completa o reportar en el repositorio del proyecto.

**Última actualización:** 2024-01-20  
**Versión:** 1.0.0
