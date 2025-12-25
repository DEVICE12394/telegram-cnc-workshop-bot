// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs');
const path = require('path');

class WorkshopDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.ensureDirectoryExists(this.dataDir);
    this.machines = this.loadMachines();
    this.tasks = this.loadTasks();
    this.users = this.loadUsers();
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Máquinas CNC disponibles
   */
  loadMachines() {
    const machinesFile = path.join(this.dataDir, 'machines.json');
    if (fs.existsSync(machinesFile)) {
      const content = fs.readFileSync(machinesFile, 'utf-8');
      return JSON.parse(content);
    }

    const defaultMachines = [
      {
        id: 'CNC-01',
        name: 'Torno CNC-01',
        type: 'Torno',
        status: 'activa',
        lastMaintenance: new Date('2025-01-01'),
        hoursOfOperation: 2456,
      },
      {
        id: 'CNC-02',
        name: 'Fresadora CNC-02',
        type: 'Fresadora',
        status: 'activa',
        lastMaintenance: new Date('2024-12-15'),
        hoursOfOperation: 3124,
      },
      {
        id: 'CNC-03',
        name: 'Perforadora CNC-03',
        type: 'Perforadora',
        status: 'mantenimiento',
        lastMaintenance: new Date('2025-01-10'),
        hoursOfOperation: 1890,
      },
      {
        id: 'CNC-04',
        name: 'Grabadora CNC-04',
        type: 'Grabadora',
        status: 'activa',
        lastMaintenance: new Date('2024-11-20'),
        hoursOfOperation: 2645,
      },
    ];

    this.saveMachines(defaultMachines);
    return defaultMachines;
  }

  /**
   * Tareas del taller
   */
  loadTasks() {
    const tasksFile = path.join(this.dataDir, 'tasks.json');
    if (fs.existsSync(tasksFile)) {
      const content = fs.readFileSync(tasksFile, 'utf-8');
      return JSON.parse(content);
    }

    const defaultTasks = [
      {
        id: 'TASK-001',
        title: 'Fabricación de piezas serie A',
        description: 'Producción de 50 piezas tipo A',
        machine: 'CNC-01',
        status: 'en progreso',
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        progress: 65,
      },
      {
        id: 'TASK-002',
        title: 'Grabado de referencia',
        description: 'Grabado de números de serie',
        machine: 'CNC-04',
        status: 'pendiente',
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        progress: 0,
      },
    ];

    this.saveTasks(defaultTasks);
    return defaultTasks;
  }

  /**
   * Usuarios del sistema
   */
  loadUsers() {
    const usersFile = path.join(this.dataDir, 'users.json');
    if (fs.existsSync(usersFile)) {
      const content = fs.readFileSync(usersFile, 'utf-8');
      return JSON.parse(content);
    }
    return [];
  }

  // ========== MÁQUINAS ==========
  saveMachines(machines) {
    const filepath = path.join(this.dataDir, 'machines.json');
    fs.writeFileSync(filepath, JSON.stringify(machines, null, 2));
  }

  getMachines() {
    return this.machines;
  }

  getMachineById(id) {
    return this.machines.find(m => m.id === id);
  }

  updateMachine(id, updates) {
    const machine = this.getMachineById(id);
    if (machine) {
      Object.assign(machine, updates);
      this.saveMachines(this.machines);
      return machine;
    }
    return null;
  }

  getActiveMachines() {
    return this.machines.filter(m => m.status === 'activa');
  }

  getMachinesInMaintenance() {
    return this.machines.filter(m => m.status === 'mantenimiento');
  }

  // ========== TAREAS ==========
  saveTasks(tasks) {
    const filepath = path.join(this.dataDir, 'tasks.json');
    fs.writeFileSync(filepath, JSON.stringify(tasks, null, 2));
  }

  getTasks() {
    return this.tasks;
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  }

  addTask(task) {
    const newTask = {
      id: `TASK-${String(this.tasks.length + 1).padStart(3, '0')}`,
      ...task,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    this.saveTasks(this.tasks);
    return newTask;
  }

  updateTask(id, updates) {
    const task = this.getTaskById(id);
    if (task) {
      Object.assign(task, updates);
      this.saveTasks(this.tasks);
      return task;
    }
    return null;
  }

  completeTask(id) {
    return this.updateTask(id, { status: 'completada', completedAt: new Date() });
  }

  getPendingTasks() {
    return this.tasks.filter(t => t.status === 'pendiente');
  }

  getTasksByMachine(machineId) {
    return this.tasks.filter(t => t.machine === machineId);
  }

  // ========== USUARIOS ==========
  saveUsers(users) {
    const filepath = path.join(this.dataDir, 'users.json');
    fs.writeFileSync(filepath, JSON.stringify(users, null, 2));
  }

  getUsers() {
    return this.users;
  }

  addUser(user) {
    const newUser = {
      id: `USER-${Date.now()}`,
      ...user,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    this.saveUsers(this.users);
    return newUser;
  }

  // ========== ESTADÍSTICAS ==========
  getWorkshopStats() {
    const activeMachines = this.getActiveMachines().length;
    const totalMachines = this.machines.length;
    const pendingTasks = this.getPendingTasks().length;
    const allTasks = this.tasks.length;

    return {
      machines: {
        total: totalMachines,
        active: activeMachines,
        inMaintenance: totalMachines - activeMachines,
      },
      tasks: {
        total: allTasks,
        pending: pendingTasks,
        inProgress: this.tasks.filter(t => t.status === 'en progreso').length,
        completed: this.tasks.filter(t => t.status === 'completada').length,
      },
      efficiency: this.calculateEfficiency(),
    };
  }

  calculateEfficiency() {
    const activeMachines = this.getActiveMachines();
    if (activeMachines.length === 0) return 0;

    const avgHours = activeMachines.reduce((sum, m) => sum + m.hoursOfOperation, 0) / activeMachines.length;
    return Math.round((avgHours / 4000) * 100);
  }
}

module.exports = { WorkshopDatabase };
