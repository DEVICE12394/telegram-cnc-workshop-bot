// Página de Analytics - JavaScript

let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
    autoRefresh(loadAnalytics, 5000);
});

/**
 * Carga todos los datos de analytics
 */
async function loadAnalytics() {
    try {
        const stats = await apiGet('/stats');
        const efficiency = await apiGet('/stats/efficiency');
        const machines = await apiGet('/machines');
        const tasks = await apiGet('/tasks');

        if (stats && machines && tasks) {
            loadCharts(stats, machines, tasks);
            loadMachinesTable(efficiency);
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

/**
 * Carga los gráficos
 */
function loadCharts(stats, machines, tasks) {
    const ctx1 = document.getElementById('machinesDistributionChart');
    const ctx2 = document.getElementById('tasksDistributionChart');
    const ctx3 = document.getElementById('hoursBarChart');

    if (!ctx1 || !ctx2 || !ctx3) return;

    // Gráfico de Distribución de Máquinas
    if (charts.machinesDistribution) charts.machinesDistribution.destroy();
    charts.machinesDistribution = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Activas', 'Mantenimiento'],
            datasets: [{
                data: [stats.machines.active, stats.machines.inMaintenance],
                backgroundColor: ['#198754', '#ffc107'],
                borderColor: '#fff',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    // Gráfico de Distribución de Tareas
    if (charts.tasksDistribution) charts.tasksDistribution.destroy();
    charts.tasksDistribution = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'En Progreso', 'Completadas'],
            datasets: [{
                data: [stats.tasks.pending, stats.tasks.inProgress, stats.tasks.completed],
                backgroundColor: ['#ffc107', '#0dcaf0', '#198754'],
                borderColor: '#fff',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });

    // Gráfico de Horas de Operación
    if (charts.hoursBar) charts.hoursBar.destroy();
    const labels = machines.map(m => m.id);
    const hours = machines.map(m => m.hoursOfOperation);

    charts.hoursBar = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Horas de Operación',
                data: hours,
                backgroundColor: '#0d6efd',
                borderColor: '#0d6efd',
                borderWidth: 1,
                borderRadius: 4,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });
}

/**
 * Carga la tabla de máquinas
 */
async function loadMachinesTable(efficiency) {
    const tbody = document.getElementById('machinesTableBody');
    let html = '';

    efficiency.forEach(machine => {
        const efficiencyClass = machine.efficiency >= 75 ? 'success' : 
                               machine.efficiency >= 50 ? 'warning' : 'danger';

        html += `
            <tr>
                <td><code>${machine.id}</code></td>
                <td>${machine.name}</td>
                <td>${machine.name.includes('Torno') ? 'Torno' : 
                       machine.name.includes('Fresadora') ? 'Fresadora' :
                       machine.name.includes('Perforadora') ? 'Perforadora' : 'Otro'}</td>
                <td>
                    <span class="badge bg-${machine.status === 'activa' ? 'success' : 'warning'}">
                        ${getStatusLabel(machine.status)}
                    </span>
                </td>
                <td>${machine.hoursOfOperation}h</td>
                <td>-</td>
                <td>
                    <span class="badge bg-${efficiencyClass}">${machine.efficiency}%</span>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}
