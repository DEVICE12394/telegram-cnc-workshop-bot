// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs');
const path = require('path');

/**
 * Tipos de alertas disponibles
 */
const AlertTypes = {
  MACHINE_MAINTENANCE: 'maintenance',
  MACHINE_FAILURE: 'machine_failure',
  TASK_DEADLINE: 'task_deadline',
  PRODUCTION_ALERT: 'production_alert',
  DOWNTIME_ALERT: 'downtime_alert',
  INVENTORY_LOW: 'inventory_low',
  SYSTEM_ERROR: 'system_error',
};

/**
 * Niveles de prioridad
 */
const AlertPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Gestor centralizado de alertas
 */
class AlertManager {
  constructor() {
    this.alertsDir = path.join(__dirname, '../data/alerts');
    this.ensureDirectoryExists(this.alertsDir);
    this.alerts = this.loadAlerts();
    this.alertRules = this.loadAlertRules();
    this.subscribers = [];
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Carga las alertas desde almacenamiento
   */
  loadAlerts() {
    const alertsFile = path.join(this.alertsDir, 'alerts.json');
    if (fs.existsSync(alertsFile)) {
      try {
        const content = fs.readFileSync(alertsFile, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error('Error loading alerts:', error);
        return [];
      }
    }
    return [];
  }

  /**
   * Carga las reglas de alertas configuradas
   */
  loadAlertRules() {
    const rulesFile = path.join(this.alertsDir, 'rules.json');
    if (fs.existsSync(rulesFile)) {
      try {
        const content = fs.readFileSync(rulesFile, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error('Error loading alert rules:', error);
        return this.getDefaultRules();
      }
    }
    return this.getDefaultRules();
  }

  /**
   * Reglas de alertas por defecto
   */
  getDefaultRules() {
    return {
      [AlertTypes.MACHINE_MAINTENANCE]: {
        enabled: true,
        hoursThreshold: 500,
        daysThreshold: 90,
        priority: AlertPriority.HIGH,
      },
      [AlertTypes.MACHINE_FAILURE]: {
        enabled: true,
        downTimeThreshold: 1800000, // 30 minutos
        priority: AlertPriority.CRITICAL,
      },
      [AlertTypes.TASK_DEADLINE]: {
        enabled: true,
        hoursBeforeDeadline: 24,
        priority: AlertPriority.MEDIUM,
      },
      [AlertTypes.PRODUCTION_ALERT]: {
        enabled: true,
        targetMissedPercent: 20,
        priority: AlertPriority.MEDIUM,
      },
      [AlertTypes.DOWNTIME_ALERT]: {
        enabled: true,
        continuousDowntimeHours: 4,
        priority: AlertPriority.HIGH,
      },
    };
  }

  /**
   * Crea una nueva alerta
   */
  createAlert(type, data = {}) {
    const rule = this.alertRules[type];
    
    if (!rule || !rule.enabled) {
      return null;
    }

    const alert = {
      id: `ALERT-${Date.now()}`,
      type: type,
      priority: rule.priority,
      title: this.getAlertTitle(type, data),
      description: this.getAlertDescription(type, data),
      data: data,
      createdAt: new Date().toISOString(),
      status: 'active', // active, acknowledged, resolved
      acknowledgedBy: null,
      acknowledgedAt: null,
      resolvedAt: null,
    };

    // No agregar duplicados recientes
    if (!this.isDuplicate(alert)) {
      this.alerts.push(alert);
      this.saveAlerts();
      this.notifySubscribers(alert);
    }

    return alert;
  }

  /**
   * Verifica si es un duplicado reciente
   */
  isDuplicate(newAlert) {
    const oneHourAgo = Date.now() - 3600000;
    return this.alerts.some(
      a =>
        a.type === newAlert.type &&
        a.status === 'active' &&
        new Date(a.createdAt).getTime() > oneHourAgo &&
        JSON.stringify(a.data) === JSON.stringify(newAlert.data)
    );
  }

  /**
   * Obtiene el título de la alerta
   */
  getAlertTitle(type, data) {
    const titles = {
      [AlertTypes.MACHINE_MAINTENANCE]: `🔧 Mantenimiento debido: ${data.machineId || 'Máquina'}`,
      [AlertTypes.MACHINE_FAILURE]: `🚨 Fallo de máquina: ${data.machineId || 'Máquina'}`,
      [AlertTypes.TASK_DEADLINE]: `⏰ Tarea próxima a vencer: ${data.taskId || 'Tarea'}`,
      [AlertTypes.PRODUCTION_ALERT]: `📉 Meta de producción no alcanzada`,
      [AlertTypes.DOWNTIME_ALERT]: `⏸️ Máquina inactiva: ${data.machineId || 'Máquina'}`,
      [AlertTypes.INVENTORY_LOW]: `📦 Inventario bajo: ${data.itemName || 'Artículo'}`,
      [AlertTypes.SYSTEM_ERROR]: `⚠️ Error del sistema`,
    };
    return titles[type] || 'Alerta del sistema';
  }

  /**
   * Obtiene la descripción de la alerta
   */
  getAlertDescription(type, data) {
    const descriptions = {
      [AlertTypes.MACHINE_MAINTENANCE]: 
        `La máquina ${data.machineId} requiere mantenimiento preventivo. ` +
        `Última revisión: ${data.lastMaintenance || 'No registrada'}. ` +
        `Horas de operación: ${data.hoursOfOperation || 0}h`,
      
      [AlertTypes.MACHINE_FAILURE]:
        `La máquina ${data.machineId} ha estado inactiva por ${data.downtimeMinutes || 0} minutos. ` +
        `Última actividad: ${data.lastActivity || 'No registrada'}`,
      
      [AlertTypes.TASK_DEADLINE]:
        `La tarea ${data.taskId} "${data.taskTitle}" vence en ${data.hoursUntilDeadline || 0} horas. ` +
        `Máquina: ${data.machineId}. Progreso: ${data.progress || 0}%`,
      
      [AlertTypes.PRODUCTION_ALERT]:
        `Producción actual: ${data.currentProduction || 0} / ${data.targetProduction || 0} unidades. ` +
        `Déficit: ${data.deficit || 0} unidades (${data.deficitPercent || 0}%)`,
      
      [AlertTypes.DOWNTIME_ALERT]:
        `La máquina ${data.machineId} está inactiva desde hace ${data.hoursDown || 0} horas. ` +
        `Verificar estado o asignar nueva tarea.`,
      
      [AlertTypes.INVENTORY_LOW]:
        `El artículo "${data.itemName}" está por debajo del nivel mínimo. ` +
        `Stock actual: ${data.currentStock || 0} / Mínimo: ${data.minimumStock || 0}`,
      
      [AlertTypes.SYSTEM_ERROR]:
        `Error: ${data.errorMessage || 'Error desconocido'}`,
    };
    return descriptions[type] || 'Alerta del sistema';
  }

  /**
   * Obtiene alertas
   */
  getAlerts(filters = {}) {
    let result = this.alerts;

    if (filters.status) {
      result = result.filter(a => a.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter(a => a.priority === filters.priority);
    }

    if (filters.type) {
      result = result.filter(a => a.type === filters.type);
    }

    if (filters.limit) {
      result = result.slice(-filters.limit).reverse();
    }

    return result;
  }

  /**
   * Obtiene alertas activas
   */
  getActiveAlerts() {
    return this.getAlerts({ status: 'active', limit: 10 });
  }

  /**
   * Obtiene alertas por prioridad
   */
  getAlertsByPriority(priority) {
    return this.getAlerts({ priority: priority, status: 'active' });
  }

  /**
   * Marca una alerta como reconocida
   */
  acknowledgeAlert(alertId, userId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date().toISOString();
      this.saveAlerts();
      return alert;
    }
    return null;
  }

  /**
   * Resuelve una alerta
   */
  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date().toISOString();
      this.saveAlerts();
      return alert;
    }
    return null;
  }

  /**
   * Suscribirse a alertas
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notifica a los suscriptores
   */
  notifySubscribers(alert) {
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert subscriber:', error);
      }
    });
  }

  /**
   * Obtiene resumen de alertas
   */
  getAlertsSummary() {
    const activeAlerts = this.getAlerts({ status: 'active' });
    const criticalCount = activeAlerts.filter(a => a.priority === AlertPriority.CRITICAL).length;
    const highCount = activeAlerts.filter(a => a.priority === AlertPriority.HIGH).length;
    const mediumCount = activeAlerts.filter(a => a.priority === AlertPriority.MEDIUM).length;
    const lowCount = activeAlerts.filter(a => a.priority === AlertPriority.LOW).length;

    return {
      totalActive: activeAlerts.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      byType: this.groupAlertsByType(activeAlerts),
    };
  }

  /**
   * Agrupa alertas por tipo
   */
  groupAlertsByType(alerts) {
    const grouped = {};
    alerts.forEach(alert => {
      if (!grouped[alert.type]) {
        grouped[alert.type] = [];
      }
      grouped[alert.type].push(alert);
    });
    return grouped;
  }

  /**
   * Limpia alertas antiguas resueltas
   */
  cleanupOldAlerts(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const initialCount = this.alerts.length;
    this.alerts = this.alerts.filter(alert => {
      if (alert.status !== 'resolved') {
        return true;
      }
      return new Date(alert.resolvedAt) > cutoffDate;
    });

    if (this.alerts.length !== initialCount) {
      this.saveAlerts();
    }

    return initialCount - this.alerts.length;
  }

  /**
   * Guarda alertas en almacenamiento
   */
  saveAlerts() {
    const filepath = path.join(this.alertsDir, 'alerts.json');
    try {
      fs.writeFileSync(filepath, JSON.stringify(this.alerts, null, 2));
    } catch (error) {
      console.error('Error saving alerts:', error);
    }
  }

  /**
   * Guarda reglas de alertas
   */
  saveAlertRules() {
    const filepath = path.join(this.alertsDir, 'rules.json');
    try {
      fs.writeFileSync(filepath, JSON.stringify(this.alertRules, null, 2));
    } catch (error) {
      console.error('Error saving alert rules:', error);
    }
  }

  /**
   * Actualiza una regla
   */
  updateRule(type, rule) {
    this.alertRules[type] = { ...this.alertRules[type], ...rule };
    this.saveAlertRules();
    return this.alertRules[type];
  }

  /**
   * Obtiene estadísticas de alertas
   */
  getStats() {
    return {
      total: this.alerts.length,
      active: this.getAlerts({ status: 'active' }).length,
      acknowledged: this.getAlerts({ status: 'acknowledged' }).length,
      resolved: this.getAlerts({ status: 'resolved' }).length,
    };
  }
}

module.exports = {
  AlertManager,
  AlertTypes,
  AlertPriority,
};
