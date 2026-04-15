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
        <div
        id="edit-form-${task.id}"
        class="edit-overlay"
        data-testid="test-todo-edit-form"
      >
        <form class="edit-form">
          <div class="edit-form-top">
            <div class="edit-form-main">
              <div class="edit-form-heading">
               <label class="edit-field"> 
               <span>Change title</span>
               <input
                  id="edit-title-${task.id}"
                  type="text"
                  data-testid="test-todo-edit-title-input"
                  
                  placeholder="Enter task title"
                />
               </label>
                <label className="edit-field">
                  <span>Change priority</span>
                  <select
                  id="edit-priority-${task.id}"
                  data-testid="test-todo-edit-priority-select"
                >
                  <option value="Low"></option>
                  <option value="Medium"></option>
                  <option value="High"></option>
                  Set Priority
                </select>
                </label>
              </div>
             <label className="edit-field">
               <textarea
                id="edit-description-text-area-${task.id}"
                data-testid="test-todo-edit-description-input"
                placeholder="Enter text description"
              ></textarea>
             </label>
            </div>
            <div class="edit-form-date">
            <label>
              <span>Change due date</span>
              <input
              type="datetime-local"
              id="edit-due-date-${task.id}"
              data-testid="test-todo-edit-due-date-input"
              placeholder="Enter due date"
            />
            </label>
            </div>
          </div>

          <div class="action-buttons">
            <button data-testid="test-todo-save-button" id="save-edit-${task.id}" data-task-id="${task.id}">
            Save changes
          </button>
          <button data-testid="test-todo-cancel-button" id="cancel-edit-${task.id}">
            Cancel
          </button>
          </div>
        </form>
      </div>
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
              id="edit-button"
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
      </article> `;
  });

  todoList.innerHTML = taskCards.join("");

  connectCompleteToggles();
}

function connectCompleteToggles() {
  const toggles = document.querySelectorAll(
    '[data-testid="test-todo-complete-toggle"]',
  );

  //
  toggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const taskId = Number(toggle.dataset.taskId);

      //tasks refers to the global array of task objects, each containing specific properties
      //find() is an array method that searches through tasks and returns the first object
      //The condition (task) => task.id ===taskId is an arrow function that checks if the current
      //task's id property equals the taskId equals the taskId extracted from the toggle's data attribute
      //Its purpose is to locate the specific task object in the tasks array that corresponds to the toggle being interacted with.
      //If no match is found, task becomes undefined. This step links the UI element back to the data model
      const task = tasks.find((task) => task.id === taskId);

      //This exits the callback function without executing any further code,
      //It checks if the task did not loacte any matching tasks
      //It is a defensive check to prevent errors, such as trying to access properties on a non-existent object
      //It ensures the code only proceeds if a valid task was found, avoiding potential runtime crashes
      if (!task) return;

      //toggle.checked is a boolean property of the HTML checkbox input element(true, if the box is checked, false if unchecked)
      //task.completed directly assigns the boolean value to the completed property of the found task object
      //Its purpose is synchronize the task's internal completion state with the current state of the UI toggle.
      //For example if the user checks the box, the task completed becomes true
      task.completed = toggle.checked;
      //This assigns task.status to either "Completed" or "Pending" if toggle.checked is true.
      task.status = toggle.checked ? "Completed" : "Pending";

      renderTasks();
    });
  });
}

let editingTaskId;

function editTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);
  document.getElementById(`edit-title-${taskId}`).value = task.title;
  document.getElementById(`edit-description-text-area-${taskId}`).value =
    task.description;
  document.getElementById(`edit-due-date-${taskId}`).value = task.dueDate;
  document.getElementById(`edit-priority-${taskId}`).value = task.priority;
  
  document.getElementById(`edit-form-${taskId}`).style.display = "block";
  document
  .querySelector(`[data-task-id="${taskId}"]`)
  .classList.add("is-editing");

  editingTaskId = taskId;

  document
  .getElementById(`save-edit-${editingTaskId}`)
  .addEventListener("click", () => {
    const task = tasks.find((task) => task.id === editingTaskId);
    const title = document.getElementById(`edit-title-${editingTaskId}`).value;
    const description = document.getElementById(
      `description-text-area-${editingTaskId}`,
    ).value;
    const dueDate = document.getElementById(
      `edit-due-date-${editingTaskId}`,
    ).value;
    const priority = document.getElementById(
      `edit-priority-${editingTaskId}`,
    ).value;

    task.title = title;
    task.description = description;
    task.priority = priority;
    task.dueDate = dueDate;

    document.getElementById(`edit-form-${editingTaskId}`).style.display =
      "none";

      document.getElementById(`cancel-edit-${editingTaskId}`).addEventListener("click", () => {
  document.getElementById(`edit-title-${editingTaskId}`).value = "";
  document.getElementById(`edit-description-text-area-${editingTaskId}`).value = "";
  document.getElementById(`edit-due-date-${editingTaskId}`).value = "";
  document.getElementById(`edit-priority-${editingTaskId}`).value = "";
  document.getElementById(`edit-container-${editingTaskId}`).style.display = "none";
});

    renderTasks();
  });
}

function deleteTask(taskId) {
  alert(`Delete clicked for task ${taskId}`);
}

renderTasks();

const saveButtons = document.querySelectorAll(
  '[data-testid="test-todo-save-button"]',
);


//This loops through each button in the editable mode in each task card
saveButtons.forEach((button) => {
  button.addEventListener("click", ()=>{ 
    //This is done so the browser can know the particular task that the save changes will be made
    const taskId = Number(button.dataset.taskId);

    //Searches the tasks array of objects to find the particular task to save changes
    const task = tasks.find((task) => task.id === taskId);
    if(!task) return;

    const title = document.getElementById(`edit-title-${taskId}`).value;
    const description = document.getElementById(`edit-description-text-area-${taskId}`).value;
    const dueDate = document.getElementById(`edit-due-date-${taskId}`).value;
    const priority = document.getElementById(`edit-priority-${taskId}`).value;

    task.title = title;
    task.description = description;
    task.priority = priority;
    task.dueDate = dueDate;

    renderTasks();
  });
});





// const editForm = document.querySelectorAll(".edit-form");
// editForm.addEventListener("submit", function (event) {
//   event.preventDefault();
// });

setInterval(() => {
  renderTasks();
}, 30000);
