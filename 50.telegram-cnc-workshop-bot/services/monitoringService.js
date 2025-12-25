// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AlertTypes, AlertPriority } = require('./alertManager');

/**
 * Servicio de monitoreo automático
 * Verifica condiciones y genera alertas automáticamente
 */
class MonitoringService {
  constructor(alertManager, database) {
    this.alertManager = alertManager;
    this.database = database;
    this.monitoringInterval = null;
    this.isMonitoring = false;
  }

  /**
   * Inicia el monitoreo automático
   */
  startMonitoring(intervalMs = 300000) {
    // 5 minutos por defecto
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    console.log('🔍 Servicio de monitoreo iniciado');

    // Monitorear inmediatamente
    this.runChecks();

    // Luego periodicamente
    this.monitoringInterval = setInterval(() => {
      this.runChecks();
    }, intervalMs);
  }

  /**
   * Detiene el monitoreo automático
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('🛑 Servicio de monitoreo detenido');
  }

  /**
   * Ejecuta todos los chequeos
   */
  async runChecks() {
    try {
      this.checkMachinesMaintenance();
      this.checkMachinesDowntime();
      this.checkTaskDeadlines();
      this.checkProductionTargets();
      this.cleanupOldAlerts();
    } catch (error) {
      console.error('Error en monitoreo:', error);
      this.alertManager.createAlert(AlertTypes.SYSTEM_ERROR, {
        errorMessage: error.message,
      });
    }
  }

  /**
   * Chequea necesidad de mantenimiento preventivo
   */
  checkMachinesMaintenance() {
    const machines = this.database.getMachines();
    const maintenanceRule = this.alertManager.alertRules[AlertTypes.MACHINE_MAINTENANCE];

    machines.forEach(machine => {
      const lastMaintenance = new Date(machine.lastMaintenance);
      const daysSinceMaintenance = (Date.now() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24);

      // Verificar si excede días configurados
      if (daysSinceMaintenance > maintenanceRule.daysThreshold) {
        this.alertManager.createAlert(AlertTypes.MACHINE_MAINTENANCE, {
          machineId: machine.id,
          machineName: machine.name,
          lastMaintenance: machine.lastMaintenance,
          hoursOfOperation: machine.hoursOfOperation,
          daysSinceMaintenance: Math.floor(daysSinceMaintenance),
        });
      }

      // Verificar horas de operación
      if (machine.hoursOfOperation > maintenanceRule.hoursThreshold) {
        this.alertManager.createAlert(AlertTypes.MACHINE_MAINTENANCE, {
          machineId: machine.id,
          machineName: machine.name,
          hoursOfOperation: machine.hoursOfOperation,
          threshold: maintenanceRule.hoursThreshold,
        });
      }
    });
  }

  /**
   * Chequea máquinas inactivas por mucho tiempo
   */
  checkMachinesDowntime() {
    const machines = this.database.getMachines();
    const downtimeRule = this.alertManager.alertRules[AlertTypes.DOWNTIME_ALERT];
    const continuousDowntimeHours = downtimeRule.continuousDowntimeHours || 4;

    machines.forEach(machine => {
      const tasks = this.database.getTasksByMachine(machine.id);
      const lastTask = tasks.filter(t => t.status !== 'pendiente').pop();

      if (lastTask) {
        const hoursSinceLastTask = (Date.now() - new Date(lastTask.createdAt).getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastTask > continuousDowntimeHours && machine.status === 'activa') {
          this.alertManager.createAlert(AlertTypes.DOWNTIME_ALERT, {
            machineId: machine.id,
            machineName: machine.name,
            hoursDown: Math.floor(hoursSinceLastTask),
            lastActivity: lastTask.createdAt,
          });
        }
      }
    });
  }

  /**
   * Chequea tareas próximas a vencer
   */
  checkTaskDeadlines() {
    const tasks = this.database.getTasks();
    const deadlineRule = this.alertManager.alertRules[AlertTypes.TASK_DEADLINE];
    const hoursThreshold = deadlineRule.hoursBeforeDeadline || 24;

    tasks.forEach(task => {
      if (task.status === 'pendiente' || task.status === 'en progreso') {
        const hoursUntilDeadline = (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60);

        if (hoursUntilDeadline < hoursThreshold && hoursUntilDeadline > 0) {
          this.alertManager.createAlert(AlertTypes.TASK_DEADLINE, {
            taskId: task.id,
            taskTitle: task.title,
            machineId: task.machine,
            dueDate: task.dueDate,
            hoursUntilDeadline: Math.floor(hoursUntilDeadline),
            progress: task.progress,
          });
        }

        // Alerta si ya vencida
        if (hoursUntilDeadline < 0) {
          this.alertManager.createAlert(AlertTypes.TASK_DEADLINE, {
            taskId: task.id,
            taskTitle: task.title,
            machineId: task.machine,
            dueDate: task.dueDate,
            hoursOverdue: Math.floor(Math.abs(hoursUntilDeadline)),
            progress: task.progress,
            isOverdue: true,
          });
        }
      }
    });
  }

  /**
   * Chequea meta de producción
   */
  checkProductionTargets() {
    const productionRule = this.alertManager.alertRules[AlertTypes.PRODUCTION_ALERT];
    if (!productionRule || !productionRule.enabled) {
      return;
    }

    // Obtener producción del día
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayProduction = this.calculateDailyProduction(today);

    // Meta diaria (ajustable)
    const dailyTarget = 100; // Unidades
    const hoursWorked = Math.floor((Date.now() - today.getTime()) / (1000 * 60 * 60));
    const hoursRemaining = 24 - hoursWorked;

    if (hoursRemaining > 0) {
      const expectedProduction = (dailyTarget / 24) * hoursWorked;
      const deficit = expectedProduction - todayProduction;
      const deficitPercent = ((deficit / expectedProduction) * 100).toFixed(1);

      if (deficitPercent > productionRule.targetMissedPercent) {
        this.alertManager.createAlert(AlertTypes.PRODUCTION_ALERT, {
          currentProduction: todayProduction,
          targetProduction: dailyTarget,
          expectedProduction: Math.floor(expectedProduction),
          deficit: Math.floor(deficit),
          deficitPercent: deficitPercent,
          hoursWorked: hoursWorked,
          hoursLeft: hoursRemaining,
        });
      }
    }
  }

  /**
   * Calcula producción diaria
   */
  calculateDailyProduction(date) {
    const tasks = this.database.getTasks();
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = tasks.filter(
      t =>
        new Date(t.completedAt || t.createdAt) >= today &&
        new Date(t.completedAt || t.createdAt) < tomorrow &&
        t.status === 'completada'
    );

    // Aproximación: 10 unidades por tarea completada
    return todayTasks.length * 10;
  }

  /**
   * Limpia alertas antiguas
   */
  cleanupOldAlerts() {
    const deleted = this.alertManager.cleanupOldAlerts(30);
    if (deleted > 0) {
      console.log(`🧹 Limpiadas ${deleted} alertas antiguas`);
    }
  }

  /**
   * Obtiene estado del monitoreo
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      lastCheck: this.lastCheckTime,
    };
  }

  /**
   * Fuerza un chequeo manual
   */
  forceCheck() {
    console.log('⚡ Chequeo manual de monitoreo iniciado');
    this.runChecks();
  }
}

module.exports = { MonitoringService };
