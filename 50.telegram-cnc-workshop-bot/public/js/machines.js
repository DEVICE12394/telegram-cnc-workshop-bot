// Página de Máquinas - JavaScript

let currentMachine = null;

document.addEventListener('DOMContentLoaded', () => {
    loadMachines();
    autoRefresh(loadMachines, 5000);
});

/**
 * Carga las máquinas
 */
async function loadMachines() {
    try {
        const machines = await apiGet('/machines');
        if (!machines) return;

        updateStats(machines);
        displayMachines(machines);
    } catch (error) {
        console.error('Error loading machines:', error);
    }
}

/**
 * Actualiza las estadísticas
 */
function updateStats(machines) {
    const active = machines.filter(m => m.status === 'activa').length;
    const maintenance = machines.filter(m => m.status === 'mantenimiento').length;

    document.getElementById('totalMachines').textContent = machines.length;
    document.getElementById('activeMachines').textContent = active;
    document.getElementById('maintenanceMachines').textContent = maintenance;
}

/**
 * Muestra las máquinas
 */
function displayMachines(machines) {
    const container = document.getElementById('machinesList');
    let html = '';

    machines.forEach(machine => {
        const statusClass = machine.status === 'activa' ? 'active' : 'maintenance';
        const statusLabel = machine.status === 'activa' ? 'Activa' : 'Mantenimiento';
        const efficiency = Math.round((machine.hoursOfOperation / 4000) * 100);

        html += `
            <div class="col-lg-6 mb-3">
                <div class="machine-card fade-in" onclick="openMachineModal('${machine.id}')">
                    <div class="machine-header">
                        <h5 class="machine-name">${machine.name}</h5>
                        <span class="machine-status ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="machine-info">
                        <div class="machine-info-item">
                            <span class="machine-info-label">Tipo</span>
                            <span class="machine-info-value">${machine.type}</span>
                        </div>
                        <div class="machine-info-item">
                            <span class="machine-info-label">Horas Op.</span>
                            <span class="machine-info-value">${machine.hoursOfOperation}h</span>
                        </div>
                        <div class="machine-info-item">
                            <span class="machine-info-label">Eficiencia</span>
                            <span class="machine-info-value">${efficiency}%</span>
                        </div>
                        <div class="machine-info-item">
                            <span class="machine-info-label">Último Mto.</span>
                            <span class="machine-info-value">${formatDateShort(machine.lastMaintenance)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Abre modal con detalles de máquina
 */
async function openMachineModal(machineId) {
    const machine = await apiGet(`/machines/${machineId}`);
    if (!machine) return;

    currentMachine = machine;

    const efficiency = Math.round((machine.hoursOfOperation / 4000) * 100);
    const statusClass = machine.status === 'activa' ? 'success' : 'warning';

    let html = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-muted">ID</h6>
                <p>${machine.id}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted">Tipo</h6>
                <p>${machine.type}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-muted">Estado</h6>
                <p><span class="badge bg-${statusClass}">${getStatusLabel(machine.status)}</span></p>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted">Eficiencia</h6>
                <p>${efficiency}%</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-muted">Horas de Operación</h6>
                <p>${machine.hoursOfOperation}h</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted">Último Mantenimiento</h6>
                <p>${formatDate(machine.lastMaintenance)}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="progress" style="height: 2rem;">
                    <div class="progress-bar" style="width: ${Math.min(efficiency, 100)}%;">
                        ${efficiency}%
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('machineModalBody').innerHTML = html;
    new bootstrap.Modal(document.getElementById('machineModal')).show();
}

/**
 * Registra mantenimiento
 */
async function logMaintenance() {
    if (!currentMachine) return;

    const result = await apiPut(`/machines/${currentMachine.id}`, {
        lastMaintenance: new Date().toISOString(),
        hoursOfOperation: currentMachine.hoursOfOperation,
        status: 'activa',
    });

    if (result) {
        showSuccess('Mantenimiento registrado');
        bootstrap.Modal.getInstance(document.getElementById('machineModal')).hide();
        loadMachines();
    }
}
