const addTaskBtn = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.classList.add("task");
  li.textContent = taskText;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    li.classList.add("deleting");
    setTimeout(() => li.remove(), 300);
  };

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
  taskInput.value = "";

  let startX = 0;
  let moved = false;

  li.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    moved = false;
  });

  li.addEventListener("touchmove", (e) => {
    const diffX = e.touches[0].clientX - startX;
    if (diffX < -30) {
      li.classList.add("show-delete");
      moved = true;
    }
    if (diffX > 30 && moved) {
      li.classList.remove("show-delete");
    }
  });
}
