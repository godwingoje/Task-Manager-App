const tasks = [
  {
    id: 1,
    tag: "Work",
    title: "Start Project",
    status: "Pending",
    priority: "High",
    dueDate: "2026-04-16T23:59:00",
    description: "Set up a project using HTML, CSS, and JavaScript.",
    completed: false,
  },
  {
    id: 2,
    tag: "Urgent",
    title: "Submit assignment",
    status: "Completed",
    priority: "Medium",
    dueDate: "2026-04-13T23:59:00",
    description: "Finish and submit Task card assignment.",
    completed: true,
  },
  {
    id: 3,
    tag: "Moderate",
    title: "Exercise",
    status: "Pending",
    priority: "Low",
    dueDate: "2026-04-14T18:00:00",
    description: "Arm workout for 40 minutes.",
    completed: false,
  },
];

const todoList = document.getElementById("todo-list");

function formatDueDate(dueDate) {
  const date = new Date(dueDate);

  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getTimeRemaining(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);

  const difference = due.getTime() - now.getTime();

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const absoluteDifference = Math.abs(difference);

  if (absoluteDifference < minute) {
    return "Due now!";
  }

  if (difference < 0) {
    const overdueDays = Math.floor(absoluteDifference / day);
    const overdueHours = Math.floor(absoluteDifference / hour);
    const overdueMinutes = Math.floor(absoluteDifference / minute);

    if (overdueDays >= 1) {
      return overdueDays === 1
        ? "Overdue by 1 day"
        : `Overdue by ${overdueDays} days`;
    }

    if (overdueHours >= 1) {
      return overdueHours === 1
        ? "Overdue by 1 hour"
        : `Overdue by ${overdueHours} hours`;
    }

    return overdueMinutes === 1
      ? "Overdue by 1 minute"
      : `Overdue by ${overdueMinutes} minutes`;
  }

  const remainingDays = Math.floor(difference / day);
  const remainingHours = Math.floor(difference / hour);
  const remainingMinutes = Math.floor(difference / minute);

  if (remainingDays >= 2) {
    return `Due in ${remainingDays} days`;
  }

  if (remainingDays === 1) {
    return "Due tomorrow";
  }

  if (remainingHours >= 1) {
    return remainingHours === 1
      ? "Due in 1 hour"
      : `Due in ${remainingHours} hours`;
  }

  return remainingMinutes === 1
    ? "Due in 1 minute"
    : `Due in ${remainingMinutes} minutes`;
}

function getStatusClass(status) {
  return status.toLowerCase().replace(" ", "-");
}

function getPriorityClass(priority) {
  return priority.toLowerCase();
}

function renderTasks() {
  const taskCards = tasks.map((task) => {
    return `
      <article class="todo-card" data-testid="test-todo-card" data-task-id="${task.id}">
        <div class="todo-card__content">
          <div class="todo-card__top">
            <div class="todo-card__main">
              <div
                class="todo-tags"
                role="list"
                data-testid="test-todo-tags"
              >
                <span
                  class="todo-tag"
                  role="listitem"
                  data-testid="test-todo-tag-${task.tag.toLowerCase()}"
                >
                  ${task.tag}
                </span>
              </div>

              <div class="todo-card__heading-row">
                <h2
                  class="todo-title ${task.completed ? "completed" : ""}"
                  data-testid="test-todo-title"
                >
                  ${task.title}
                </h2>

                <div class="todo-badges">
                  <span
                    class="todo-status ${getStatusClass(task.status)}"
                    data-testid="test-todo-status"
                  >
                    ${task.status}
                  </span>

                  <span
                    class="todo-priority ${getPriorityClass(task.priority)}"
                    data-testid="test-todo-priority"
                  >
                    Priority ${task.priority}
                  </span>
                </div>
              </div>
            </div>

            <div class="todo-date-block">
              <time
                class="todo-date"
                datetime="${task.dueDate}"
                data-testid="test-todo-due-date"
              >
                ${formatDueDate(task.dueDate)}
              </time>

              <span
                class="todo-time-remaining"
                data-testid="test-todo-time-remaining"
                aria-live="polite"
              >
                ${getTimeRemaining(task.dueDate)}
              </span>
            </div>
          </div>

          <p
            class="todo-description"
            data-testid="test-todo-description"
          >
            ${task.description}
          </p>

          <div class="todo-actions">
            <label class="todo-toggle-label">
              <input
                class="todo-toggle-input"
                type="checkbox"
                data-testid="test-todo-complete-toggle"
                data-task-id="${task.id}"
                ${task.completed ? "checked" : ""}
              />

              <span class="todo-toggle-track">
                <span class="todo-toggle-thumb"></span>
              </span>

              <span class="todo-toggle-text">Complete</span>
            </label>

            <button
              class="todo-button"
              type="button"
              data-testid="test-todo-edit-button"
              onclick="editTask(${task.id})"
            >
              Edit
            </button>

            <button
              class="todo-button"
              type="button"
              data-testid="test-todo-delete-button"
              onclick="deleteTask(${task.id})"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    `;
  });

  todoList.innerHTML = taskCards.join("");

  connectCompleteToggles();
}

function connectCompleteToggles() {
  const toggles = document.querySelectorAll(
    '[data-testid="test-todo-complete-toggle"]'
  );

  toggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const taskId = Number(toggle.dataset.taskId);

      const task = tasks.find((task) => task.id === taskId);

      if (!task) return;

      task.completed = toggle.checked;
      task.status = toggle.checked ? "Completed" : "Pending";

      renderTasks();
    });
  });
}

function editTask(taskId) {
  console.log("Edit clicked", taskId);
}

function deleteTask(taskId) {
  alert(`Delete clicked for task ${taskId}`);
}

renderTasks();

setInterval(() => {
  renderTasks();
}, 30000);
