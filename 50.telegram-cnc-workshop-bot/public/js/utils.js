// Funciones Utilitarias Compartidas

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Realiza una petición GET a la API
 */
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en GET:', error);
        showError('Error al cargar datos');
        return null;
    }
}

/**
 * Realiza una petición POST a la API
 */
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en POST:', error);
        showError('Error al procesar datos');
        return null;
    }
}

/**
 * Realiza una petición PUT a la API
 */
async function apiPut(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en PUT:', error);
        showError('Error al actualizar datos');
        return null;
    }
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

/**
 * Muestra un mensaje de éxito
 */
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

/**
 * Formatea una fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Formatea una fecha corta
 */
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Calcula tiempo transcurrido
 */
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return `hace ${seconds}s`;
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
    return `hace ${Math.floor(seconds / 86400)}d`;
}

/**
 * Obtiene emoji según prioridad
 */
function getPriorityEmoji(priority) {
    const emojis = {
        critical: '🚨',
        high: '⚠️',
        medium: '⏰',
        low: 'ℹ️',
    };
    return emojis[priority] || 'ℹ️';
}

/**
 * Obtiene etiqueta de prioridad
 */
function getPriorityLabel(priority) {
    const labels = {
        critical: 'Crítica',
        high: 'Alta',
        medium: 'Media',
        low: 'Baja',
    };
    return labels[priority] || 'Desconocida';
}

/**
 * Obtiene etiqueta de estado
 */
function getStatusLabel(status) {
    const labels = {
        active: 'Activa',
        acknowledged: 'Reconocida',
        resolved: 'Resuelta',
        pending: 'Pendiente',
        'in progreso': 'En Progreso',
        completada: 'Completada',
        activa: 'Activa',
        mantenimiento: 'Mantenimiento',
    };
    return labels[status] || status;
}

/**
 * Obtiene color según prioridad
 */
function getPriorityColor(priority) {
    const colors = {
        critical: 'danger',
        high: 'warning',
        medium: 'info',
        low: 'secondary',
    };
    return colors[priority] || 'secondary';
}

/**
 * Obtiene color según estado
 */
function getStatusColor(status) {
    const colors = {
        active: 'danger',
        acknowledged: 'warning',
        resolved: 'success',
        pending: 'warning',
        'in progreso': 'info',
        completada: 'success',
        activa: 'success',
        mantenimiento: 'warning',
    };
    return colors[status] || 'secondary';
}

/**
 * Espera un tiempo
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Refresca datos cada X segundos
 */
function autoRefresh(callback, interval = 5000) {
    callback();
    return setInterval(callback, interval);
}

/**
 * Detiene el auto-refresh
 */
function stopAutoRefresh(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
    }
}
