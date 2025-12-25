// Dashboard Principal - JavaScript

let alertsChart, machinesChart, tasksChart, efficiencyChart;
let refreshInterval;

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    refreshInterval = autoRefresh(loadDashboard, 5000);
});

/**
 * Carga todos los datos del dashboard
 */
async function loadDashboard() {
    try {
        const data = await apiGet('/dashboard');
        if (!data) return;

        updateStats(data);
        updateAlerts(data);
        loadCharts(data);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

/**
 * Actualiza las estadísticas
 */
function updateStats(data) {
    document.getElementById('activeMachines').textContent = data.machines.active;
    document.getElementById('totalMachines').textContent = data.machines.total;
    document.getElementById('activeAlerts').textContent = data.alerts.totalActive;
    document.getElementById('tasksInProgress').textContent = data.tasks.inProgress;
    document.getElementById('totalTasks').textContent = data.tasks.total;
    document.getElementById('efficiency').textContent = data.stats.efficiency + '%';

    const breakdown = `🔴 ${data.alerts.critical} | 🟠 ${data.alerts.high} | 🟡 ${data.alerts.medium}`;
    document.getElementById('alertsBreakdown').textContent = breakdown;
}

/**
 * Actualiza las alertas recientes
 */
async function updateAlerts(data) {
    if (data.alerts.totalActive === 0) {
        document.getElementById('recentAlerts').innerHTML =
            '<div class="alert alert-success">✅ No hay alertas activas</div>';
        return;
    }

    const alerts = await apiGet('/alerts?status=active&limit=5');
    if (!alerts || !alerts.alerts) return;

    let html = '';
    alerts.alerts.forEach(alert => {
        const emoji = getPriorityEmoji(alert.priority);
        const badgeClass = alert.priority.toLowerCase();

        html += `
            <div class="alert-item ${badgeClass}" onclick="showAlertDetail('${alert.id}')">
                <div class="alert-title">${emoji} ${alert.title}</div>
                <div class="alert-desc">${alert.description.substring(0, 100)}...</div>
                <div class="alert-meta">
                    <span>${getTimeAgo(alert.createdAt)}</span>
                    <span class="alert-badge ${alert.status}">${getStatusLabel(alert.status)}</span>
                </div>
            </div>
        `;
    });

    document.getElementById('recentAlerts').innerHTML = html;
}

/**
 * Carga todos los gráficos
 */
async function loadCharts(data) {
    const ctx1 = document.getElementById('alertsChart');
    const ctx2 = document.getElementById('machinesChart');
    const ctx3 = document.getElementById('tasksChart');
    const ctx4 = document.getElementById('efficiencyChart');

    if (!ctx1 || !ctx2 || !ctx3 || !ctx4) return;

    // Gráfico de Alertas
    if (alertsChart) alertsChart.destroy();
    alertsChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Crítica', 'Alta', 'Media', 'Baja'],
            datasets: [{
                data: [data.alerts.critical, data.alerts.high, data.alerts.medium, data.alerts.low],
                backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#6c757d'],
                borderColor: '#fff',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    // Gráfico de Máquinas
    if (machinesChart) machinesChart.destroy();
    machinesChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Activas', 'Mantenimiento'],
            datasets: [{
                data: [data.machines.active, data.machines.maintenance],
                backgroundColor: ['#198754', '#ffc107'],
                borderColor: '#fff',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    // Gráfico de Tareas
    if (tasksChart) tasksChart.destroy();
    tasksChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'En Progreso', 'Completadas'],
            datasets: [{
                data: [data.tasks.pending, data.tasks.inProgress, data.tasks.completed],
                backgroundColor: ['#ffc107', '#0dcaf0', '#198754'],
                borderColor: '#fff',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    // Gráfico de Eficiencia
    if (efficiencyChart) efficiencyChart.destroy();
    const efficiency = await apiGet('/stats/efficiency');
    if (efficiency) {
        const labels = efficiency.map(m => m.id);
        const values = efficiency.map(m => m.efficiency);

        efficiencyChart = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Eficiencia (%)',
                    data: values,
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });
    }
}

/**
 * Muestra detalles de alerta
 */
async function showAlertDetail(alertId) {
    // Implementar modal con detalles
    console.log('Ver alerta:', alertId);
}
