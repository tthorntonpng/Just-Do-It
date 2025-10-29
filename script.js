const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');

// Load saved tasks
document.addEventListener('DOMContentLoaded', loadTasks);

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e){
    if(e.key === 'Enter') addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    if(taskText === '') return;

    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
    });

    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks();
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        if(task.completed) li.classList.add('completed');
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}
