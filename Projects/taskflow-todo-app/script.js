const STORAGE_KEY = "taskflow.tasks.v1";
const THEME_KEY = "taskflow.theme";

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = document.querySelector("#emptyTitle");
const emptyText = document.querySelector("#emptyText");
const formHint = document.querySelector("#formHint");
const searchInput = document.querySelector("#searchInput");
const editDialog = document.querySelector("#editDialog");
const editForm = document.querySelector("#editForm");
const editInput = document.querySelector("#editInput");

let tasks = loadTasks();
let currentFilter = "all";
let editingTaskId = null;

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter(isValidTask) : [];
  } catch (error) {
    console.warn("Could not read saved tasks:", error);
    return [];
  }
}

function isValidTask(task) {
  return task && typeof task.id === "string" &&
    typeof task.text === "string" && typeof task.completed === "boolean";
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    formHint.textContent = "Your changes are saved automatically.";
  } catch (error) {
    formHint.textContent = "Could not save tasks. Check your browser storage settings.";
    console.error("Could not save tasks:", error);
  }
}

function createTask(text) {
  const task = {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random()),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(task);
  saveTasks();
  renderTasks();
}

function updateTask(id, changes) {
  tasks = tasks.map(task => task.id === id ? { ...task, ...changes } : task);
  saveTasks();
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function getVisibleTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  return tasks.filter(task => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);
    return matchesFilter && task.text.toLowerCase().includes(searchTerm);
  });
}

function renderTasks() {
  taskList.replaceChildren();
  const visibleTasks = getVisibleTasks();

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" as ${task.completed ? "active" : "completed"}`);
    checkbox.addEventListener("change", () => updateTask(task.id, { completed: checkbox.checked }));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-button";
    editButton.textContent = "✎";
    editButton.title = "Edit task";
    editButton.setAttribute("aria-label", `Edit "${task.text}"`);
    editButton.addEventListener("click", () => openEditDialog(task));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-button delete";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete task";
    deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
    deleteButton.addEventListener("click", () => {
      if (window.confirm(`Delete "${task.text}"?`)) removeTask(task.id);
    });

    actions.append(editButton, deleteButton);
    item.append(checkbox, text, actions);
    taskList.append(item);
  });

  const completed = tasks.filter(task => task.completed).length;
  document.querySelector("#totalCount").textContent = tasks.length;
  document.querySelector("#activeCount").textContent = tasks.length - completed;
  document.querySelector("#completedCount").textContent = completed;
  document.querySelector("#footerCount").textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;

  const hasVisibleTasks = visibleTasks.length > 0;
  emptyState.hidden = hasVisibleTasks;
  if (!hasVisibleTasks) {
    if (searchInput.value.trim()) {
      emptyTitle.textContent = "No matching tasks";
      emptyText.textContent = "Try another search phrase.";
    } else if (currentFilter === "completed") {
      emptyTitle.textContent = "No completed tasks";
      emptyText.textContent = "Completed tasks will appear here.";
    } else if (currentFilter === "active") {
      emptyTitle.textContent = "All caught up!";
      emptyText.textContent = "You have no remaining tasks.";
    } else {
      emptyTitle.textContent = "Nothing on your list yet";
      emptyText.textContent = "Add a task above and make your first move.";
    }
  }
}

function openEditDialog(task) {
  editingTaskId = task.id;
  editInput.value = task.text;
  editDialog.showModal();
  editInput.focus();
  editInput.select();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    formHint.textContent = "Please enter a task before adding.";
    taskInput.focus();
    return;
  }
  createTask(text);
  taskForm.reset();
  taskInput.focus();
});

editForm.addEventListener("submit", event => {
  if (event.submitter && event.submitter.value === "cancel") return;
  event.preventDefault();
  const text = editInput.value.trim();
  if (!text) {
    editInput.setCustomValidity("Task name cannot be empty.");
    editInput.reportValidity();
    return;
  }
  editInput.setCustomValidity("");
  if (editingTaskId) updateTask(editingTaskId, { text });
  editingTaskId = null;
  editDialog.close();
});

editInput.addEventListener("input", () => editInput.setCustomValidity(""));

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(filterButton => {
      const selected = filterButton === button;
      filterButton.classList.toggle("active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    renderTasks();
  });
});

searchInput.addEventListener("input", renderTasks);

document.querySelector("#clearCompleted").addEventListener("click", () => {
  const completedCount = tasks.filter(task => task.completed).length;
  if (!completedCount) {
    formHint.textContent = "There are no completed tasks to clear.";
    return;
  }
  if (window.confirm(`Clear ${completedCount} completed ${completedCount === 1 ? "task" : "tasks"}?`)) {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
  }
});

const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");

function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");
  themeIcon.textContent = theme === "light" ? "☾" : "☀";
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "light" ? "dark" : "light"} theme`);
}

const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
});

renderTasks();
