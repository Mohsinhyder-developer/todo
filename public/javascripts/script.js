let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentView = 'all';
let editingTaskId = null;

// Initialize user data
const userData = JSON.parse(localStorage.getItem('userData')) || {
    name: 'User Name',
    profilePic: 'https://via.placeholder.com/32'
};
document.getElementById('userName').textContent = userData.name;
document.getElementById('profilePic').src = userData.profilePic;

function addTask(text) {
    if (!text.trim()) return;
    
    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        important: false,
        date: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    document.getElementById('newTaskInput').value = '';
}

function toggleTaskComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
}

function toggleTaskImportant(id) {
    tasks = tasks.map(task =>
        task.id === id ? {...task, important: !task.important} : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function editTask(id) {
    editingTaskId = id;
    const task = tasks.find(t => t.id === id);
    document.getElementById('editTaskInput').value = task.text;
    document.getElementById('editTaskModal').classList.add('active');
}

function saveEditedTask() {
    const newText = document.getElementById('editTaskInput').value;
    if (newText.trim()) {
        tasks = tasks.map(task =>
            task.id === editingTaskId ? {...task, text: newText} : task
        );
        saveTasks();
        renderTasks();
    }
    closeModal('editTaskModal');
}

function editProfile() {
    document.getElementById('editNameInput').value = userData.name;
    document.getElementById('editProfileModal').classList.add('active');
}

function saveProfile() {
    const newName = document.getElementById('editNameInput').value;
    if (newName.trim()) {
        userData.name = newName;
        document.getElementById('userName').textContent = newName;
    }

    const fileInput = document.getElementById('profilePicInput');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.profilePic = e.target.result;
            document.getElementById('profilePic').src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }

    localStorage.setItem('userData', JSON.stringify(userData));
    closeModal('editProfileModal');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    editingTaskId = null;
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === view);
    });
    document.getElementById('currentView').textContent = 
        view.charAt(0).toUpperCase() + view.slice(1) + ' Tasks';
    renderTasks();
}

function getFilteredTasks() {
    switch(currentView) {
        case 'important':
            return tasks.filter(task => task.important);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateCounts();
}

function updateCounts() {
    const counts = {
        all: tasks.length,
        important: tasks.filter(t => t.important).length,
        completed: tasks.filter(t => t.completed).length
    };

    Object.entries(counts).forEach(([view, count]) => {
        const element = document.querySelector(`[data-view="${view}"] .list-count`);
        if (element) element.textContent = count;
    });
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    const taskList = document.getElementById('taskList');
    
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}"
                 onclick="toggleTaskComplete(${task.id})"></div>
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-date">${new Date(task.date).toLocaleDateString()}</div>
            </div>
            <div class="task-actions">
                <button class="task-btn ${task.important ? 'important' : ''}"
                        onclick="toggleTaskImportant(${task.id})">
                    <i class="fas fa-star"></i>
                </button>
                <button class="task-btn" onclick="editTask(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
}

// Event Listeners
document.getElementById('newTaskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(e.target.value);
    }
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchView(item.dataset.view));
});

// Initial render
renderTasks();
