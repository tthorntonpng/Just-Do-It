// === Grab DOM Elements ===
const taskInput = document.querySelector('input[type="text"]');
const addButton = document.querySelector('button');
const taskList = document.querySelector('ul');
const filters = document.querySelectorAll('.filter');
const categorySelect = document.querySelector('.select-category');

// === Add a new task ===
function addTask() {
  const taskText = taskInput.value.trim();
  const category = categorySelect ? categorySelect.value : 'all';
  if (taskText === '') return;

  const li = document.createElement('li');
  li.textContent = taskText;
  li.setAttribute('data-category', category);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  li.appendChild(deleteBtn);

  taskList.appendChild(li);
  taskInput.value = '';
}

// Add button click
addButton.addEventListener('click', addTask);

// Press Enter key
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// === Filter Tasks ===
filters.forEach(filter => {
  filter.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('active'));
    filter.classList.add('active');

    const selected = filter.getAttribute('data-filter');
    document.querySelectorAll('ul li').forEach(li => {
      if (selected === 'all' || li.getAttribute('data-category') === selected) {
        li.style.display = 'flex';
      } else {
        li.style.display = 'none';
      }
    });
  });
});

// === Swipe-to-delete functionality ===
let startX = 0;
let currentX = 0;
let swipingLi = null;

taskList.addEventListener('touchstart', (e) => {
  swipingLi = e.target.closest('li');
  if (!swipingLi) return;
  startX = e.touches[0].clientX;
});

taskList.addEventListener('touchmove', (e) => {
  if (!swipingLi) return;
  currentX = e.touches[0].clientX;
  const diffX = currentX - startX;

  if (diffX < -20) { // swipe left threshold
    swipingLi.classList.add('swiping');
  } else if (diffX > 20) { // swipe right to cancel
    swipingLi.classList.remove('swiping');
  }
});

taskList.addEventListener('touchend', (e) => {
  swipingLi = null;
});

// === Delete button click ===
taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('li').remove();
  }
});
