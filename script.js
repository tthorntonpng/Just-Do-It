// Elements
const addBtn = document.getElementById('add-task-btn');
const input = document.getElementById('new-task');
const list = document.getElementById('task-list');

// Load saved tasks
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task (button or Enter)
addBtn.addEventListener('click', handleAdd);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAdd(); });

function handleAdd() {
  const text = input.value.trim();
  if (!text) return;
  addTaskToDOM(text);
  saveTask(text, false);
  input.value = '';
}

// Create DOM structure for a task item
function addTaskToDOM(text, completed = false) {
  const li = document.createElement('li');
  li.className = 'task-item' + (completed ? ' completed' : '');
  
  const span = document.createElement('div');
  span.className = 'task-text';
  span.textContent = text;

  // delete button (pink)
  const del = document.createElement('button');
  del.className = 'delete-btn';
  del.textContent = 'Delete';

  // append elements
  li.appendChild(span);
  li.appendChild(del);
  list.appendChild(li);

  // toggle complete on tap of the text
  span.addEventListener('click', () => {
    li.classList.toggle('completed');
    updateTaskStatus(text, li.classList.contains('completed'));
  });

  // Delete on tap of delete button
  del.addEventListener('click', () => {
    confirmAndRemove(li, text);
  });

  // Touch swipe handling for mobile: reveal delete on left swipe
  let startX = 0;
  let currentX = 0;
  let swiped = false;

  li.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, {passive: true});

  li.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    // reveal when dragging left past threshold
    if (diff > 20) {
      li.classList.add('swiped');
      swiped = true;
    } else if (diff < -20) {
      li.classList.remove('swiped');
      swiped = false;
    }
  }, {passive: true});

  // On touchend: if swiped far (auto-delete) else leave reveal
  li.addEventListener('touchend', (e) => {
    const diff = startX - (e.changedTouches[0].clientX || currentX);
    if (diff > 120) {
      // swiped far enough → quick delete
      confirmAndRemove(li, text);
    }
  });

  // Desktop: allow click+drag or double-click as fallback (dblclick deletes)
  li.addEventListener('dblclick', () => confirmAndRemove(li, text));
}

// Confirm removal animation + remove from storage
function confirmAndRemove(li, text) {
  // animate removal
  li.classList.remove('swiped'); // hide delete button
  li.classList.add('removing');
  setTimeout(() => {
    li.remove();
    removeTaskFromStorage(text);
  }, 280);
}

// LOCAL STORAGE helpers
function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push({ text, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromStorage(text) {
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks = tasks.filter(t => t.text !== text);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskStatus(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const updated = tasks.map(t => {
    if (t.text === text) return { text: t.text, completed };
    return t;
  });
  localStorage.setItem('tasks', JSON.stringify(updated));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.forEach(t => addTaskToDOM(t.text, t.completed));
}
