// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { DialogSet, WaterfallDialog, TextPrompt, ChoicePrompt, DialogTurnStatus } = require('botbuilder-dialogs');
const { DialogHelper } = require('./dialogs/dialogHelper');
const { ReportManager } = require('./services/reportManager');
const { WorkshopDatabase } = require('./services/workshopDatabase');
const { AlertManager, AlertTypes } = require('./services/alertManager');
const { NotificationService } = require('./services/notificationService');
const { MonitoringService } = require('./services/monitoringService');

const DIALOG_STATE_PROPERTY = 'dialogState';
const USER_STATE_PROPERTY = 'userState';

class CNCWorkshopBot extends ActivityHandler {
  constructor(telegramAdapter = null) {
    super();
    this.conversationState = new Map();
    this.userState = new Map();
    this.reportManager = new ReportManager();
    this.database = new WorkshopDatabase();
    this.alertManager = new AlertManager();
    this.notificationService = telegramAdapter ? new NotificationService(telegramAdapter) : null;
    this.monitoringService = new MonitoringService(this.alertManager, this.database);
    this.telegramAdapter = telegramAdapter;
    
    // Create dialog set
    this.dialogSet = new DialogSet();
    
    // Add dialogs
    this.dialogHelper = new DialogHelper(this.dialogSet, this.database);

    // Suscribir a nuevas alertas
    if (this.alertManager) {
      this.alertManager.subscribe((alert) => {
        console.log(`🚨 Nueva alerta: ${alert.title}`);
        if (this.notificationService && this.telegramAdapter) {
          this.notificationService.sendNotification(alert);
        }
      });
    }

    // Iniciar monitoreo automático
    if (this.monitoringService) {
      this.monitoringService.startMonitoring(300000); // Cada 5 minutos
    }
    
    this.onMessage(async (context, next) => {
      await this.handleMessage(context);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      for (const member of context.activity.membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(this.getWelcomeMessage());
        }
      }
      await next();
    });
  }

  async handleMessage(context) {
    const text = context.activity.text?.toLowerCase().trim();
    
    if (!text) {
      await context.sendActivity('Por favor, escribe un mensaje válido.');
      return;
    }

    // Route based on user input
    if (text === '/start' || text === 'inicio' || text === 'menú') {
      await this.showMainMenu(context);
    } else if (text.includes('alerta')) {
      await this.handleAlerts(context);
    } else if (text.includes('reporte') || text.includes('generar')) {
      await this.handleReportGeneration(context);
    } else if (text.includes('importar')) {
      await this.handleReportImport(context);
    } else if (text.includes('máquina') || text.includes('maquina')) {
      await this.handleMachineStatus(context);
    } else if (text.includes('tarea') || text.includes('trabajo')) {
      await this.handleTaskManagement(context);
    } else if (text.includes('ayuda') || text.includes('help')) {
      await this.showHelpMenu(context);
    } else {
      await this.handleConversation(context, text);
    }
  }

  async showMainMenu(context) {
    const alertSummary = this.alertManager.getAlertsSummary();
    const alertIndicator = alertSummary.totalActive > 0 
      ? `🔴 *${alertSummary.totalActive} alertas activas*` 
      : '✅ Sin alertas';

    const menu = `
🏭 *CNC Workshop Bot - Menú Principal*

${alertIndicator}

Selecciona una opción:

📊 Reportes - Generar e importar reportes
🚨 Alertas - Ver alertas del sistema
🔧 Máquinas - Ver estado de máquinas
📋 Tareas - Gestionar tareas
📈 Estadísticas - Ver estadísticas del taller
⚙️ Configuración - Ajustar parámetros
❓ Ayuda - Mostrar guía de uso

Escribe el número o nombre de la opción.
    `;
    await context.sendActivity(menu);
  }

  async handleReportGeneration(context) {
    const reply = `
📊 *Generador de Reportes*

¿Qué tipo de reporte deseas generar?

1. Reporte de producción diaria
2. Reporte de máquinas
3. Reporte de tiempo de inactividad
4. Reporte completo del taller

Responde con el número.
    `;
    await context.sendActivity(reply);
  }

  async handleAlerts(context) {
    const activeAlerts = this.alertManager.getActiveAlerts();
    const summary = this.alertManager.getAlertsSummary();

    let message = `
🚨 *Sistema de Alertas*

*Resumen:*
🔴 Críticas: ${summary.critical}
🟠 Altas: ${summary.high}
🟡 Medias: ${summary.medium}
🔵 Bajas: ${summary.low}

    `;

    if (activeAlerts.length === 0) {
      message += `✅ *No hay alertas activas*`;
    } else {
      message += `*Alertas Activas:*\n`;
      activeAlerts.forEach((alert, index) => {
        const emoji = this.getAlertEmoji(alert.priority);
        message += `\n${index + 1}. ${emoji} ${alert.title}\n`;
        message += `   ID: ${alert.id.substring(0, 12)}...\n`;
      });
    }

    message += `\n*Opciones:*
1️⃣ Ver detalle de alerta
2️⃣ Marcar como reconocida
3️⃣ Resolver alerta
4️⃣ Ver configuración
5️⃣ Limpiar alertas antiguas

Responde con el número.
    `;

    await context.sendActivity(message);
  }

  getAlertEmoji(priority) {
    const emojis = {
      'critical': '🚨',
      'high': '⚠️',
      'medium': '⏰',
      'low': 'ℹ️',
    };
    return emojis[priority] || 'ℹ️';
  }

  async handleReportImport(context) {
    const reply = `
📥 *Importar Reportes*

Puedes enviar archivos en los siguientes formatos:
- CSV
- Excel (.xlsx)
- JSON

Por favor, adjunta el archivo o proporciona la URL.
    `;
    await context.sendActivity(reply);
  }

  async handleMachineStatus(context) {
    const reply = `
🔧 *Estado de Máquinas*

Máquinas disponibles:
1. Torno CNC-01 - Activa
2. Fresadora CNC-02 - Activa
3. Perforadora CNC-03 - Mantenimiento
4. Grabadora CNC-04 - Activa

Escribe "máquina [número]" para más detalles.
    `;
    await context.sendActivity(reply);
  }

  async handleTaskManagement(context) {
    const reply = `
📋 *Gestión de Tareas*

Opciones disponibles:

1. Ver tareas pendientes
2. Crear nueva tarea
3. Asignar tarea
4. Completar tarea
5. Ver historial

Responde con el número de la opción.
    `;
    await context.sendActivity(reply);
  }

  async handleConversation(context, userInput) {
    // Echo the user's input for conversational flow
    await context.sendActivity(
      MessageFactory.text(`Entendido: "${userInput}". ¿Hay algo más en lo que pueda ayudarte?`)
    );
  }

  async showHelpMenu(context) {
    const help = `
❓ *Ayuda - Guía de Uso*

*Comandos principales:*
- /start - Mostrar menú principal
- reportes - Generar reportes
- alertas - Ver alertas del sistema
- máquinas - Ver máquinas
- tareas - Gestionar tareas
- estadísticas - Ver datos
- monitoreo - Estado del monitoreo

*Características:*
✅ Generación automática de reportes
✅ Importación de datos
✅ Monitoreo de máquinas
✅ Alertas en tiempo real
✅ Gestión de tareas
✅ Almacenamiento de histórico

*Sistema de Alertas:*
🚨 Críticas - Requieren acción inmediata
⚠️ Altas - Importante revisar pronto
⏰ Medias - Revisar en el día
ℹ️ Bajas - Informativas

Para más ayuda, contacta al administrador.
    `;
    await context.sendActivity(help);
  }

  getWelcomeMessage() {
    return `
¡Hola! 👋 Bienvenido al *CNC Workshop Bot*

Soy tu asistente para la gestión del taller CNC. Puedo ayudarte con:

📊 Generar y analizar reportes
🚨 Alertas en tiempo real
🔧 Monitorear el estado de las máquinas
📋 Gestionar tareas y trabajos
📈 Revisar estadísticas
💾 Importar y exportar datos

Escribe /start para comenzar o "ayuda" para más información.

*Estado del Sistema:*
🟢 Monitoreo Activo
⚡ Alertas Habilitadas
📡 Conectado
    `;
  }

  async onTurn(adapter, activity) {
    // Handle the turn
    const context = {
      activity: activity,
      sendActivity: async (message) => adapter.sendMessage(activity.from.id, message),
    };

    await this.handleMessage(context);
  }
}

module.exports = { CNCWorkshopBot };
