// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

/**
 * Servidor web para el Dashboard del taller CNC
 */
class DashboardServer {
  constructor(alertManager, database, monitoringService, notificationService) {
    this.alertManager = alertManager;
    this.database = database;
    this.monitoringService = monitoringService;
    this.notificationService = notificationService;
    
    this.app = express();
    this.PORT = process.env.DASHBOARD_PORT || 3000;
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    
    // Static files
    const publicPath = path.join(__dirname, '../public');
    this.app.use(express.static(publicPath));
    
    // Headers CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  setupRoutes() {
    // ========== PÁGINAS HTML ==========
    
    // Dashboard principal
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Página de alertas
    this.app.get('/alerts', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/alerts.html'));
    });

    // Página de máquinas
    this.app.get('/machines', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/machines.html'));
    });

    // Página de tareas
    this.app.get('/tasks', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/tasks.html'));
    });

    // Página de reportes
    this.app.get('/reports', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/reports.html'));
    });

    // Página de estadísticas
    this.app.get('/analytics', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/analytics.html'));
    });

    // ========== API: DASHBOARD GENERAL ==========
    
    this.app.get('/api/dashboard', (req, res) => {
      try {
        const alerts = this.alertManager.getAlertsSummary();
        const stats = this.database.getWorkshopStats();
        const machines = this.database.getMachines();
        const tasks = this.database.getTasks();

        res.json({
          timestamp: new Date(),
          alerts: alerts,
          stats: stats,
          machines: {
            total: machines.length,
            active: machines.filter(m => m.status === 'activa').length,
            maintenance: machines.filter(m => m.status === 'mantenimiento').length,
          },
          tasks: {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'pendiente').length,
            inProgress: tasks.filter(t => t.status === 'en progreso').length,
            completed: tasks.filter(t => t.status === 'completada').length,
          },
          monitoring: this.monitoringService.getStatus(),
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ========== API: ALERTAS ==========
    
    this.app.get('/api/alerts', (req, res) => {
      try {
        const status = req.query.status || 'active';
        const limit = req.query.limit || 50;
        const alerts = this.alertManager.getAlerts({ status, limit });
        res.json({ alerts, total: alerts.length });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/alerts/summary', (req, res) => {
      try {
        const summary = this.alertManager.getAlertsSummary();
        res.json(summary);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/alerts/:id', (req, res) => {
      try {
        const alert = this.alertManager.alerts.find(a => a.id === `ALERT-${req.params.id}`);
        if (alert) {
          res.json(alert);
        } else {
          res.status(404).json({ error: 'Alerta no encontrada' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/alerts/:id/acknowledge', (req, res) => {
      try {
        const alert = this.alertManager.acknowledgeAlert(`ALERT-${req.params.id}`, req.body.userId);
        res.json(alert || { error: 'Alerta no encontrada' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/alerts/:id/resolve', (req, res) => {
      try {
        const alert = this.alertManager.resolveAlert(`ALERT-${req.params.id}`);
        res.json(alert || { error: 'Alerta no encontrada' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ========== API: MÁQUINAS ==========
    
    this.app.get('/api/machines', (req, res) => {
      try {
        const machines = this.database.getMachines();
        res.json(machines);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/machines/:id', (req, res) => {
      try {
        const machine = this.database.getMachineById(req.params.id);
        if (machine) {
          res.json(machine);
        } else {
          res.status(404).json({ error: 'Máquina no encontrada' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.put('/api/machines/:id', (req, res) => {
      try {
        const machine = this.database.updateMachine(req.params.id, req.body);
        res.json(machine || { error: 'Máquina no encontrada' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ========== API: TAREAS ==========
    
    this.app.get('/api/tasks', (req, res) => {
      try {
        const tasks = this.database.getTasks();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/tasks/:id', (req, res) => {
      try {
        const task = this.database.getTaskById(req.params.id);
        if (task) {
          res.json(task);
        } else {
          res.status(404).json({ error: 'Tarea no encontrada' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/tasks', (req, res) => {
      try {
        const task = this.database.addTask(req.body);
        res.json(task);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.put('/api/tasks/:id', (req, res) => {
      try {
        const task = this.database.updateTask(req.params.id, req.body);
        res.json(task || { error: 'Tarea no encontrada' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ========== API: ESTADÍSTICAS ==========
    
    this.app.get('/api/stats', (req, res) => {
      try {
        const stats = this.database.getWorkshopStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/stats/efficiency', (req, res) => {
      try {
        const machines = this.database.getMachines();
        const efficiency = machines.map(m => ({
          id: m.id,
          name: m.name,
          hoursOfOperation: m.hoursOfOperation,
          efficiency: Math.round((m.hoursOfOperation / 4000) * 100),
          status: m.status,
        }));
        res.json(efficiency);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ========== API: MONITOREO ==========
    
    this.app.get('/api/monitoring/status', (req, res) => {
      try {
        const status = this.monitoringService.getStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/monitoring/check', (req, res) => {
      try {
        this.monitoringService.forceCheck();
        res.json({ message: 'Chequeo forzado iniciado' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/monitoring/start', (req, res) => {
      try {
        this.monitoringService.startMonitoring();
        res.json({ message: 'Monitoreo iniciado' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/monitoring/stop', (req, res) => {
      try {
        this.monitoringService.stopMonitoring();
        res.json({ message: 'Monitoreo detenido' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ========== ERROR HANDLING ==========
    
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });

    this.app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ error: err.message });
    });
  }

  /**
   * Inicia el servidor
   */
  start() {
    this.app.listen(this.PORT, () => {
      console.log(`🌐 Dashboard web disponible en http://localhost:${this.PORT}`);
      console.log(`📊 Alertas: http://localhost:${this.PORT}/alerts`);
      console.log(`🔧 Máquinas: http://localhost:${this.PORT}/machines`);
      console.log(`📋 Tareas: http://localhost:${this.PORT}/tasks`);
    });
  }
}

module.exports = { DashboardServer };
