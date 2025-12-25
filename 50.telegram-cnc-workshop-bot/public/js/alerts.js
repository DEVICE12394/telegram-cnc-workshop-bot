// Página de Alertas - JavaScript

let currentAlert = null;

document.addEventListener('DOMContentLoaded', () => {
    loadAlerts();
});

/**
 * Carga las alertas
 */
async function loadAlerts() {
    try {
        const data = await apiGet('/alerts/summary');
        if (!data) return;

        updateSummary(data);
        displayAlerts();
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

/**
 * Actualiza el resumen de alertas
 */
function updateSummary(data) {
    document.getElementById('criticalCount').textContent = data.critical;
    document.getElementById('highCount').textContent = data.high;
    document.getElementById('mediumCount').textContent = data.medium;
    document.getElementById('lowCount').textContent = data.low;
}

/**
 * Obtiene el filtro aplicado
 */
function getFilters() {
    return {
        status: document.getElementById('statusFilter').value,
        priority: document.getElementById('priorityFilter').value,
    };
}

/**
 * Filtra y muestra alertas
 */
async function filterAlerts() {
    const filters = getFilters();
    let url = '/alerts';

    if (filters.status) {
        url += `?status=${filters.status}`;
    }

    displayAlerts(url);
}

/**
 * Muestra la lista de alertas
 */
async function displayAlerts(url = '/alerts?status=active') {
    const data = await apiGet(url);
    if (!data || !data.alerts) return;

    const alerts = data.alerts.filter(a => {
        const priorityFilter = document.getElementById('priorityFilter').value;
        return !priorityFilter || a.priority === priorityFilter;
    });

    let html = '';

    if (alerts.length === 0) {
        html = '<div class="alert alert-info">No hay alertas que coincidan con los filtros</div>';
    } else {
        alerts.forEach(alert => {
            const emoji = getPriorityEmoji(alert.priority);
            const badgeClass = alert.priority.toLowerCase();

            html += `
                <div class="alert-item ${badgeClass} fade-in" onclick="openAlertModal('${alert.id}')">
                    <div class="alert-title">${emoji} ${alert.title}</div>
                    <div class="alert-desc">${alert.description.substring(0, 120)}...</div>
                    <div class="alert-meta">
                        <span>${getTimeAgo(alert.createdAt)}</span>
                        <span class="alert-badge ${alert.status}">${getStatusLabel(alert.status)}</span>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('alertsList').innerHTML = html;
}

/**
 * Abre modal con detalles de alerta
 */
async function openAlertModal(alertId) {
    const data = await apiGet(`/alerts/${alertId.split('-')[1]}`);
    if (!data) return;

    currentAlert = data;

    const emoji = getPriorityEmoji(data.priority);
    const priorityLabel = getPriorityLabel(data.priority);
    const statusLabel = getStatusLabel(data.status);

    let html = `
        <div class="mb-3">
            <h6 class="text-muted">ID</h6>
            <p><code>${data.id}</code></p>
        </div>
        <div class="mb-3">
            <h6 class="text-muted">Prioridad</h6>
            <p>${emoji} ${priorityLabel}</p>
        </div>
        <div class="mb-3">
            <h6 class="text-muted">Estado</h6>
            <p>${statusLabel}</p>
        </div>
        <div class="mb-3">
            <h6 class="text-muted">Descripción</h6>
            <p>${data.description}</p>
        </div>
        <div class="mb-3">
            <h6 class="text-muted">Reportada</h6>
            <p>${formatDate(data.createdAt)} (${getTimeAgo(data.createdAt)})</p>
        </div>
        ${data.acknowledgedAt ? `
        <div class="mb-3">
            <h6 class="text-muted">Reconocida por</h6>
            <p>${data.acknowledgedBy} en ${formatDate(data.acknowledgedAt)}</p>
        </div>
        ` : ''}
        ${data.resolvedAt ? `
        <div class="mb-3">
            <h6 class="text-muted">Resuelta</h6>
            <p>${formatDate(data.resolvedAt)}</p>
        </div>
        ` : ''}
        <div class="alert alert-light">
            <strong>Datos adicionales:</strong>
            <pre>${JSON.stringify(data.data, null, 2)}</pre>
        </div>
    `;

    document.getElementById('alertModalBody').innerHTML = html;

    // Actualizar botones según estado
    const acknowledgeBtn = document.getElementById('acknowledgeBtn');
    const resolveBtn = document.getElementById('resolveBtn');

    if (data.status === 'active') {
        acknowledgeBtn.style.display = 'inline-block';
        resolveBtn.style.display = 'inline-block';
    } else if (data.status === 'acknowledged') {
        acknowledgeBtn.style.display = 'none';
        resolveBtn.style.display = 'inline-block';
    } else {
        acknowledgeBtn.style.display = 'none';
        resolveBtn.style.display = 'none';
    }

    new bootstrap.Modal(document.getElementById('alertModal')).show();
}

/**
 * Reconoce una alerta
 */
async function acknowledgeAlert() {
    if (!currentAlert) return;

    const result = await apiPost(`/alerts/${currentAlert.id.split('-')[1]}/acknowledge`, {
        userId: 'dashboard-user',
    });

    if (result) {
        showSuccess('Alerta reconocida');
        bootstrap.Modal.getInstance(document.getElementById('alertModal')).hide();
        loadAlerts();
    }
}

/**
 * Resuelve una alerta
 */
async function resolveAlert() {
    if (!currentAlert) return;

    const result = await apiPost(`/alerts/${currentAlert.id.split('-')[1]}/resolve`, {});

    if (result) {
        showSuccess('Alerta resuelta');
        bootstrap.Modal.getInstance(document.getElementById('alertModal')).hide();
        loadAlerts();
    }
}
