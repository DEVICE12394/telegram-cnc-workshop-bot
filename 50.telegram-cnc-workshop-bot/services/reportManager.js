// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

class ReportManager {
  constructor() {
    this.reportsDir = path.join(__dirname, '../data/reports');
    this.ensureDirectoryExists(this.reportsDir);
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Genera un reporte de producción
   */
  generateProductionReport(data = {}) {
    const report = {
      timestamp: new Date(),
      type: 'production',
      title: 'Reporte de Producción Diaria',
      data: {
        totalUnitsProduced: data.totalUnits || 0,
        targetUnits: data.target || 0,
        completionPercentage: data.completionPercentage || 0,
        machines: data.machines || [],
        efficiency: data.efficiency || 0,
      },
    };

    return this.saveReport(report);
  }

  /**
   * Genera un reporte de máquinas
   */
  generateMachineReport(machineData = {}) {
    const report = {
      timestamp: new Date(),
      type: 'machines',
      title: 'Reporte de Estado de Máquinas',
      data: {
        totalMachines: machineData.total || 0,
        activeMachines: machineData.active || 0,
        maintenanceMachines: machineData.maintenance || 0,
        machines: machineData.machines || [],
      },
    };

    return this.saveReport(report);
  }

  /**
   * Genera un reporte de tiempo de inactividad
   */
  generateDowntimeReport(downtimeData = {}) {
    const report = {
      timestamp: new Date(),
      type: 'downtime',
      title: 'Reporte de Tiempo de Inactividad',
      data: {
        totalDowntime: downtimeData.totalDowntime || 0,
        incidents: downtimeData.incidents || [],
        averageDowntime: downtimeData.averageDowntime || 0,
      },
    };

    return this.saveReport(report);
  }

  /**
   * Genera un reporte completo del taller
   */
  generateComprehensiveReport(allData = {}) {
    const report = {
      timestamp: new Date(),
      type: 'comprehensive',
      title: 'Reporte Completo del Taller',
      data: {
        production: allData.production || {},
        machines: allData.machines || {},
        downtime: allData.downtime || {},
        tasks: allData.tasks || {},
      },
    };

    return this.saveReport(report);
  }

  /**
   * Guarda un reporte en archivo
   */
  saveReport(report) {
    const timestamp = report.timestamp.toISOString().split('T')[0];
    const filename = `${report.type}_${timestamp}_${Date.now()}.json`;
    const filepath = path.join(this.reportsDir, filename);

    try {
      fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
      return {
        success: true,
        filename: filename,
        filepath: filepath,
        report: report,
      };
    } catch (error) {
      console.error('Error saving report:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Importa un reporte desde archivo
   */
  importReport(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const report = JSON.parse(content);
      return {
        success: true,
        report: report,
      };
    } catch (error) {
      console.error('Error importing report:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Exporta un reporte a CSV
   */
  exportToCSV(reportData, filename) {
    try {
      const parser = new Parser();
      const csv = parser.parse(reportData);
      const filepath = path.join(this.reportsDir, filename + '.csv');
      fs.writeFileSync(filepath, csv);
      return {
        success: true,
        filepath: filepath,
      };
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene lista de reportes
   */
  getReportsList() {
    try {
      const files = fs.readdirSync(this.reportsDir);
      return files.filter(f => f.endsWith('.json'));
    } catch (error) {
      console.error('Error getting reports list:', error);
      return [];
    }
  }

  /**
   * Obtiene un reporte específico
   */
  getReport(filename) {
    const filepath = path.join(this.reportsDir, filename);
    return this.importReport(filepath);
  }

  /**
   * Genera resumen de reportes
   */
  generateSummary(reportsList) {
    const summary = {
      totalReports: reportsList.length,
      reports: reportsList,
      generatedAt: new Date(),
    };
    return summary;
  }
}

module.exports = { ReportManager };
