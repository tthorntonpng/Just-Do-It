// DOM Elements
const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task button
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        createTask(taskText);
        saveTaskToStorage(taskText);
        taskInput.value = '';
    }
});

// Create a task element
function createTask(text) {
    const li = document.createElement('li');
    li.innerText = text;

    // Toggle completed on click
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskInStorage(li.innerText, li.classList.contains('completed'));
    });

    // Add swipe/delete functionality
    li.addEventListener('dblclick', () => { // double-click as fallback for mobile swipe
        deleteTask(li);
    });

    taskList.appendChild(li);
}

// Delete task with slide animation
function deleteTask(taskElement) {
    taskElement.classList.add('slide-out'); // CSS animation class
    taskElement.addEventListener('animationend', () => {
        taskElement.remove();
        removeTaskFromStorage(taskElement.innerText);
    });
}

// LocalStorage functions
function saveTaskToStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: task, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(taskText, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(t => {
        if (t.text === taskText) t.completed = completed;
        return t;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(t => {
        createTask(t.text);
        if (t.completed) {
            const li = Array.from(taskList.children).find(el => el.innerText === t.text);
            if (li) li.classList.add('completed');
        }
    });
}
