// === Elements ===
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const taskList = document.getElementById('taskList');
const filters = document.querySelectorAll('.filter');

let tasks = [];

// === Add Task ===
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const category = categorySelect.value;

  if (taskText === '') return;

  const task = { text: taskText, category: category };
  tasks.push(task);
  renderTasks();

  taskInput.value = '';
});

// === Render Tasks ===
function renderTasks(filterCategory = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => 
    filterCategory === 'all' || task.category === filterCategory
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.add('task');
    li.innerHTML = `
      <span><strong>[${task.category}]</strong> ${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

// === Delete Task ===
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(currentFilter);
}

// === Filter Buttons ===
let currentFilter = 'all';
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.category;
    renderTasks(currentFilter);
  });
});
