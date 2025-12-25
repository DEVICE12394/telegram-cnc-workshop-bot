// Página de Tareas - JavaScript

let currentTask = null;
let machines = [];

document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
    autoRefresh(loadTasks, 5000);
});

/**
 * Carga datos iniciales
 */
async function loadInitialData() {
    machines = await apiGet('/machines') || [];
    populateMachineSelect();
    loadTasks();
}

/**
 * Llena el select de máquinas
 */
function populateMachineSelect() {
    const select = document.getElementById('taskMachine');
    let html = '<option value="">Seleccionar máquina...</option>';

    machines.forEach(machine => {
        html += `<option value="${machine.id}">${machine.name}</option>`;
    });

    select.innerHTML = html;
}

/**
 * Carga las tareas
 */
async function loadTasks() {
    try {
        const tasks = await apiGet('/tasks');
        if (!tasks) return;

        updateStats(tasks);
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

/**
 * Actualiza las estadísticas
 */
function updateStats(tasks) {
    const pending = tasks.filter(t => t.status === 'pendiente').length;
    const inProgress = tasks.filter(t => t.status === 'en progreso').length;
    const completed = tasks.filter(t => t.status === 'completada').length;

    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('completedTasks').textContent = completed;
}

/**
 * Muestra las tareas
 */
function displayTasks(tasks) {
    const container = document.getElementById('tasksList');
    let html = '';

    if (tasks.length === 0) {
        html = '<div class="alert alert-info">No hay tareas</div>';
    } else {
        tasks.forEach(task => {
            const statusClass = task.status === 'pendiente' ? 'pending' : 
                               task.status === 'en progreso' ? 'in-progress' : 'completed';
            const hoursLeft = (new Date(task.dueDate) - new Date()) / 3600000;

            html += `
                <div class="task-item fade-in" onclick="openTaskModal('${task.id}')">
                    <div class="task-header">
                        <h6 class="task-title">${task.title}</h6>
                        <span class="task-status ${statusClass}">${getStatusLabel(task.status)}</span>
                    </div>
                    <p class="task-desc">${task.description}</p>
                    <div class="task-progress">
                        <div class="progress">
                            <div class="progress-bar" style="width: ${task.progress}%"></div>
                        </div>
                        <small>${task.progress}% completado</small>
                    </div>
                    <div class="task-meta">
                        <span>🔧 ${task.machine}</span>
                        <span>${hoursLeft > 0 ? `⏱️ ${Math.floor(hoursLeft)}h` : '❌ Vencida'}</span>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

/**
 * Abre modal con detalles de tarea
 */
async function openTaskModal(taskId) {
    const task = await apiGet(`/tasks/${taskId}`);
    if (!task) return;

    currentTask = task;

    const hoursLeft = (new Date(task.dueDate) - new Date()) / 3600000;
    const isOverdue = hoursLeft < 0;

    let html = `
        <div class="mb-3">
            <h6 class="text-muted">ID</h6>
            <p><code>${task.id}</code></p>
        </div>
        <div class="mb-3">
            <h6 class="text-muted">Descripción</h6>
            <p>${task.description}</p>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <h6 class="text-muted">Máquina</h6>
                <p>${task.machine}</p>
            </div>
            <div class="col-md-6 mb-3">
                <h6 class="text-muted">Estado</h6>
                <p><span class="badge bg-${getStatusColor(task.status)}">${getStatusLabel(task.status)}</span></p>
            </div>
        </div>
        <div class="mb-3">
            <h6 class="text-muted">Progreso</h6>
            <div class="progress" style="height: 2rem;">
                <div class="progress-bar" style="width: ${task.progress}%;">
                    ${task.progress}%
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <h6 class="text-muted">Creada</h6>
                <p>${formatDate(task.createdAt)}</p>
            </div>
            <div class="col-md-6 mb-3">
                <h6 class="text-muted">Vencimiento</h6>
                <p>${formatDate(task.dueDate)}</p>
                <small class="${isOverdue ? 'text-danger' : 'text-success'}">
                    ${isOverdue ? `❌ Vencida hace ${Math.abs(Math.floor(hoursLeft))}h` : `⏱️ Faltan ${Math.floor(hoursLeft)}h`}
                </small>
            </div>
        </div>
    `;

    document.getElementById('taskModalBody').innerHTML = html;

    // Mostrar botón completar solo si no está completada
    const completeBtn = document.getElementById('completeBtn');
    completeBtn.style.display = task.status === 'completada' ? 'none' : 'inline-block';

    new bootstrap.Modal(document.getElementById('taskModal')).show();
}

/**
 * Crea una nueva tarea
 */
async function createTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const machine = document.getElementById('taskMachine').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (!title || !machine || !dueDate) {
        showError('Por favor completa todos los campos obligatorios');
        return;
    }

    const result = await apiPost('/tasks', {
        title,
        description,
        machine,
        dueDate: new Date(dueDate).toISOString(),
        status: 'pendiente',
        progress: 0,
    });

    if (result) {
        showSuccess('Tarea creada exitosamente');
        document.getElementById('newTaskForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('newTaskModal')).hide();
        loadTasks();
    }
}

/**
 * Completa una tarea
 */
async function completeTask() {
    if (!currentTask) return;

    const result = await apiPut(`/tasks/${currentTask.id}`, {
        status: 'completada',
        progress: 100,
        completedAt: new Date().toISOString(),
    });

    if (result) {
        showSuccess('Tarea completada');
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        loadTasks();
    }
}
