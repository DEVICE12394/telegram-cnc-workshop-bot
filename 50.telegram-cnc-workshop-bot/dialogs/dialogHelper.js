// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class DialogHelper {
  constructor(dialogSet, database) {
    this.dialogSet = dialogSet;
    this.database = database;
  }

  /**
   * Formatea el estado de una máquina para mostrar
   */
  formatMachineStatus(machine) {
    const statusEmoji = machine.status === 'activa' ? '✅' : '🔧';
    return `
${statusEmoji} *${machine.name}*
Tipo: ${machine.type}
Estado: ${machine.status}
Horas de operación: ${machine.hoursOfOperation}h
Último mantenimiento: ${new Date(machine.lastMaintenance).toLocaleDateString('es-ES')}
    `;
  }

  /**
   * Formatea una tarea para mostrar
   */
  formatTask(task) {
    const statusEmoji = task.status === 'completada' ? '✅' : task.status === 'en progreso' ? '⏳' : '📋';
    return `
${statusEmoji} *${task.title}*
ID: ${task.id}
Estado: ${task.status}
Máquina: ${task.machine}
Progreso: ${task.progress}%
Vencimiento: ${new Date(task.dueDate).toLocaleDateString('es-ES')}
Descripción: ${task.description}
    `;
  }

  /**
   * Formatea estadísticas del taller
   */
  formatStats() {
    const stats = this.database.getWorkshopStats();
    return `
📊 *Estadísticas del Taller*

*Máquinas:*
- Total: ${stats.machines.total}
- Activas: ${stats.machines.active}
- En mantenimiento: ${stats.machines.inMaintenance}

*Tareas:*
- Total: ${stats.tasks.total}
- Pendientes: ${stats.tasks.pending}
- En progreso: ${stats.tasks.inProgress}
- Completadas: ${stats.tasks.completed}

*Eficiencia:* ${stats.efficiency}%
    `;
  }

  /**
   * Crea botones de opciones
   */
  createOptions(options) {
    return options.map(opt => ({ text: opt, callback_data: opt }));
  }

  /**
   * Valida entrada del usuario
   */
  validateInput(input, type = 'text') {
    if (!input) return false;

    switch (type) {
      case 'text':
        return input.trim().length > 0;
      case 'number':
        return !isNaN(parseInt(input));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      default:
        return true;
    }
  }
}

module.exports = { DialogHelper };
