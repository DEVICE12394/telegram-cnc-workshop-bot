// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AlertTypes, AlertPriority } = require('./alertManager');

/**
 * Servicio de notificaciones
 * Envía alertas a través de Telegram
 */
class NotificationService {
  constructor(telegramAdapter) {
    this.adapter = telegramAdapter;
    this.notificationQueue = [];
    this.isProcessing = false;
    this.subscribers = new Map(); // userId -> chatId
  }

  /**
   * Registra a un usuario para recibir notificaciones
   */
  registerUser(userId, chatId) {
    this.subscribers.set(userId, chatId);
  }

  /**
   * Desregistra a un usuario
   */
  unregisterUser(userId) {
    this.subscribers.delete(userId);
  }

  /**
   * Envía una notificación
   */
  async sendNotification(alert, userId = null) {
    const message = this.formatAlertMessage(alert);

    if (userId) {
      const chatId = this.subscribers.get(userId);
      if (chatId) {
        await this.adapter.sendMessage(chatId, message);
      }
    } else {
      // Envía a todos los suscriptores
      for (const [, chatId] of this.subscribers) {
        await this.adapter.sendMessage(chatId, message);
      }
    }
  }

  /**
   * Formatea una alerta para mostrar en Telegram
   */
  formatAlertMessage(alert) {
    const priorityEmoji = this.getPriorityEmoji(alert.priority);
    const timeAgo = this.getTimeAgo(new Date(alert.createdAt));

    return `
${priorityEmoji} *${alert.title}*

${alert.description}

*Prioridad:* ${this.getPriorityLabel(alert.priority)}
*Estado:* ${this.getStatusLabel(alert.status)}
*ID:* \`${alert.id}\`
*Reportado hace:* ${timeAgo}

*Acciones:*
/acknowledge${alert.id.split('-')[1]} - Marcar como leído
/resolve${alert.id.split('-')[1]} - Resolver
    `;
  }

  /**
   * Obtiene emoji según prioridad
   */
  getPriorityEmoji(priority) {
    const emojis = {
      [AlertPriority.CRITICAL]: '🚨',
      [AlertPriority.HIGH]: '⚠️',
      [AlertPriority.MEDIUM]: '⏰',
      [AlertPriority.LOW]: 'ℹ️',
    };
    return emojis[priority] || 'ℹ️';
  }

  /**
   * Obtiene etiqueta de prioridad
   */
  getPriorityLabel(priority) {
    const labels = {
      [AlertPriority.CRITICAL]: 'CRÍTICA',
      [AlertPriority.HIGH]: 'Alta',
      [AlertPriority.MEDIUM]: 'Media',
      [AlertPriority.LOW]: 'Baja',
    };
    return labels[priority] || 'Desconocida';
  }

  /**
   * Obtiene etiqueta de estado
   */
  getStatusLabel(status) {
    const labels = {
      'active': '🔴 Activa',
      'acknowledged': '🟡 Reconocida',
      'resolved': '🟢 Resuelta',
    };
    return labels[status] || status;
  }

  /**
   * Calcula tiempo transcurrido
   */
  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  }

  /**
   * Envía un resumen de alertas
   */
  async sendAlertsSummary(alertManager, chatId) {
    const summary = alertManager.getAlertsSummary();
    const activeAlerts = alertManager.getActiveAlerts();

    let message = `
📊 *Resumen de Alertas*

*Estado General:*
🔴 Críticas: ${summary.critical}
🟠 Altas: ${summary.high}
🟡 Medias: ${summary.medium}
🔵 Bajas: ${summary.low}
📈 Total Activas: ${summary.totalActive}

    `;

    if (activeAlerts.length > 0) {
      message += `*Últimas 10 Alertas:*\n`;
      activeAlerts.slice(0, 10).forEach((alert, index) => {
        const emoji = this.getPriorityEmoji(alert.priority);
        message += `\n${index + 1}. ${emoji} ${alert.title}\n`;
        message += `   ID: \`${alert.id}\`\n`;
      });
    } else {
      message += `✅ *No hay alertas activas*`;
    }

    await this.adapter.sendMessage(chatId, message);
  }

  /**
   * Envía alerta de mantenimiento
   */
  async sendMaintenanceAlert(machine, chatId) {
    const message = `
🔧 *Alerta de Mantenimiento Preventivo*

Máquina: *${machine.name}*
ID: ${machine.id}
Tipo: ${machine.type}
Horas de operación: ${machine.hoursOfOperation}h
Última revisión: ${new Date(machine.lastMaintenance).toLocaleDateString('es-ES')}

*Acción recomendada:*
Programar mantenimiento lo antes posible para evitar fallos.

Usar: /schedule_maintenance${machine.id}
    `;

    await this.adapter.sendMessage(chatId, message);
  }

  /**
   * Envía alerta de tarea vencida
   */
  async sendTaskAlert(task, chatId) {
    const hoursLeft = (new Date(task.dueDate) - new Date()) / 3600000;
    const statusEmoji = hoursLeft < 0 ? '❌' : '⏰';

    const message = `
${statusEmoji} *Alerta de Tarea*

Tarea: *${task.title}*
ID: ${task.id}
Máquina: ${task.machine}
Progreso: ${task.progress}%

${hoursLeft < 0 
  ? `⚠️ *VENCIDA hace ${Math.abs(Math.floor(hoursLeft))} horas*`
  : `⏱️ Vence en: ${Math.floor(hoursLeft)} horas`
}

Usar: /update_task${task.id}
    `;

    await this.adapter.sendMessage(chatId, message);
  }

  /**
   * Envía alerta de máquina inactiva
   */
  async sendDowntimeAlert(machine, downtimeHours, chatId) {
    const message = `
⏸️ *Máquina Inactiva*

Máquina: *${machine.name}*
ID: ${machine.id}
Inactiva por: ${downtimeHours}h

*Verificar:*
✅ ¿Requiere mantenimiento?
✅ ¿Asignar nueva tarea?
✅ ¿Hay algún problema?

Usar: /update_machine${machine.id}
    `;

    await this.adapter.sendMessage(chatId, message);
  }

  /**
   * Envía notificación de producción baja
   */
  async sendProductionAlert(stats, target, chatId) {
    const deficit = target - stats.currentProduction;
    const deficitPercent = ((deficit / target) * 100).toFixed(1);

    const message = `
📉 *Alerta de Producción*

*Meta diaria:* ${target} unidades
*Producción actual:* ${stats.currentProduction} unidades
*Déficit:* ${deficit} unidades (${deficitPercent}%)

*Horas disponibles:* ${stats.hoursLeft || 4}h

Acelerar producción o revisar máquinas con bajo rendimiento.

Usar: /production_report
    `;

    await this.adapter.sendMessage(chatId, message);
  }

  /**
   * Envía un boletín diario
   */
  async sendDailyBulletin(alertManager, database, chatId) {
    const summary = alertManager.getAlertsSummary();
    const stats = database.getWorkshopStats();
    const today = new Date().toLocaleDateString('es-ES');

    const message = `
📋 *Boletín Diario del Taller*
${today}

*Alertas:*
🔴 Críticas: ${summary.critical}
🟠 Altas: ${summary.high}
📊 Total: ${summary.totalActive}

*Máquinas:*
✅ Activas: ${stats.machines.active}/${stats.machines.total}
🔧 En mantenimiento: ${stats.machines.inMaintenance}

*Producción:*
📈 Eficiencia: ${stats.efficiency}%

*Tareas:*
📋 Pendientes: ${stats.tasks.pending}
⏳ En progreso: ${stats.tasks.inProgress}
✅ Completadas: ${stats.tasks.completed}

Escribe /dashboard para más detalles.
    `;

    await this.adapter.sendMessage(chatId, message);
  }
}

module.exports = { NotificationService };
