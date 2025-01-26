let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentTaskId = null;
const alarmSound = new Audio('https://cdn.pixabay.com/audio/2024/03/05/audio_21f9aa3f4c.mp3');

// Initialize all event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Task actions
    document.getElementById('todoList').addEventListener('click', handleTaskActions);
    
    // Form submission
    document.getElementById('todoForm').addEventListener('submit', addNewTask);
    
    // Initial setup
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    renderTodos();
    scheduleExistingAlarms();
});

function handleTaskActions(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const listItem = btn.closest('li');
    const taskId = parseInt(listItem.dataset.id);

    if (btn.classList.contains('complete-btn')) {
        toggleComplete(taskId);
    } else if (btn.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
}


function addNewTask(e) {
    e.preventDefault();
    const titleInput = document.getElementById('taskTitle');
    const timeInput = document.getElementById('taskTime');
    
    if (!titleInput.value.trim() || !timeInput.value) {
        alert('Please fill in all required fields!');
        return;
    }

    const task = {
        id: Date.now(),
        title: titleInput.value.trim(),
        scheduled: timeInput.value,
        alarmOffset: parseInt(document.getElementById('alarmOffset').value),
        completed: false,
        created: new Date().toISOString()
    };
    
    todos.push(task);
    saveTodos();
    renderTodos();
    scheduleAlarm(task);
    e.target.reset();
}

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = todos.map(task => `
        <li data-id="${task.id}" class="flex items-center justify-between p-3 border rounded-md ${task.completed ? 'bg-green-50 opacity-75' : 'hover:bg-gray-50'} transition-all">
            <div class="flex-1">
                <h3 class="font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">
                    ${task.title}
                </h3>
                <div class="text-sm text-gray-500">
                    <span>${new Date(task.scheduled).toLocaleString()}</span>
                    <span class="ml-2 px-2 py-1 bg-blue-100 rounded">⏰ ${task.alarmOffset}m before</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button class="complete-btn p-2 ${task.completed ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'} rounded-md hover:opacity-80">
                    ${task.completed ? 'Undo' : '✓ Complete'}
                </button>
                <button class="delete-btn p-2 bg-red-100 text-red-600 rounded-md hover:opacity-80">
                    ✕ Delete
                </button>
            </div>
        </li>
    `).join('');
    generateReports();
}

function toggleComplete(id) {
    todos = todos.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTodos();
    const taskElement = document.querySelector(`li[data-id="${id}"]`);
    taskElement.classList.add('animate-pulse');
    setTimeout(() => renderTodos(), 300);
}

function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    todos = todos.filter(task => task.id !== id);
    saveTodos();
    renderTodos();
}

function scheduleAlarm(task) {
    const alarmTime = new Date(task.scheduled);
    alarmTime.setMinutes(alarmTime.getMinutes() - task.alarmOffset);
    
    const timeout = alarmTime - Date.now();
    if (timeout > 0) {
        setTimeout(() => {
            alarmSound.play();
            showBrowserNotification(task.title, task.scheduled);
            const taskElement = document.querySelector(`li[data-id="${task.id}"]`);
            if (taskElement) {
                taskElement.classList.add('animate-pulse', 'ring-2', 'ring-red-500');
                setTimeout(() => {
                    taskElement.classList.remove('animate-pulse', 'ring-2', 'ring-red-500');
                }, 5000);
            }
        }, timeout);
    }
}

function scheduleExistingAlarms() {
    todos.forEach(task => scheduleAlarm(task));
    setInterval(() => todos.forEach(task => scheduleAlarm(task)), 60000);
}

function showBrowserNotification(title, scheduledTime) {
    if (Notification.permission === 'granted') {
        new Notification(`⏰ Task Reminder: ${title}`, {
            body: `Scheduled for ${new Date(scheduledTime).toLocaleTimeString()}\n${new Date(scheduledTime).toDateString()}`,
            icon: '/notification-icon.png'
        });
    }
}

function generateReports() {
    const reports = document.getElementById('reports');
    const totalTasks = todos.length;
    const completed = todos.filter(t => t.completed).length;
    
    const completedPercent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    reports.innerHTML = `
        <div class="bg-blue-50 p-4 rounded-md">
            <h3 class="text-lg font-medium text-blue-800">Total Tasks</h3>
            <p class="text-3xl font-bold text-blue-600">${totalTasks}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-md">
            <h3 class="text-lg font-medium text-green-800">Completed</h3>
            <p class="text-3xl font-bold text-green-600">${completed} <span class="text-sm">(${completedPercent}%)</span></p>
        </div>
    `;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}