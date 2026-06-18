import type { Task } from "./types/tasks";
const DESCRIPTION_PREVIEW_LENGTH = 100;
const expandedTaskIds: number[] = [];
let editingTaskId: number | null = null;
const todoList = document.getElementById("todo-list") as HTMLElement;
const deleteDialog = document.getElementById(
  "delete-dialog",
) as HTMLDialogElement;
let taskIdToDelete: number | null = null;
const addTaskDialog = document.getElementById(
  "add-task-dialog",
) as HTMLDialogElement;
const cancelAddTaskButton = document.getElementById(
  "cancel-add-task-button",
) as HTMLButtonElement;
const submitAddTaskButton = document.getElementById(
  "submit-add-task-button",
) as HTMLButtonElement;

const confirmDeleteButton = document.getElementById(
  "confirm-delete-button",
) as HTMLButtonElement;

confirmDeleteButton.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("confirm clicked");
  console.log("taskIdToDelete:", taskIdToDelete);
  if (taskIdToDelete === null) return;

  try {
    const response = await fetch(
      `http://localhost:8000/todos/${taskIdToDelete}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

    taskIdToDelete = null;

    deleteDialog.close();

    await fetchTodos();
  } catch (error) {
    console.error("Failed to delete task", error);
  }
});
let tasks: Task[] = [];
async function fetchTodos() {
  try {
    const response = await fetch("http://localhost:8000/todos");

    if (!response.ok) {
      throw new Error(`failed to fetch: ${response.status}`);
    }
    tasks = await response.json();
    renderTasks();
  } catch (error) {
    console.error("error details", error);
  }
}

await fetchTodos();

const addTaskButton = document.getElementById(
  "add-task-button",
) as HTMLButtonElement;

addTaskButton.addEventListener("click", () => {
  addTaskDialog.showModal();
});

cancelAddTaskButton.addEventListener("click", () => {
  addTaskDialog.close();
});

submitAddTaskButton.addEventListener("click", async () => {
  const title = (document.getElementById("task-title") as HTMLInputElement).value.trim();
  const description = (
    document.getElementById("new-task-description") as HTMLTextAreaElement
  ).value.trim();
  const priority = (
    document.getElementById("new-task-priority") as HTMLSelectElement
  ).value;
  const dueDateRaw = (
    document.getElementById("new-task-due-date") as HTMLInputElement
  ).value;
  const tag = (
    document.getElementById("new-task-tag") as HTMLInputElement
  ).value;

  if (!title) {
    alert("Title is required");
    return;
  }
  const newTask = {
    title,
    description,
    priority,
    tag,
    dueDate: dueDateRaw
      ? new Date(dueDateRaw).toISOString()
      : new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };

  try {
    const response = await fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) throw new Error(`POST failed: ${response.status}`);

    await fetchTodos();
    addTaskDialog.close()
  } catch (error) {
    console.error("Failed to add task", error);
  }
});

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);

  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getTimeRemaining(dueDate: string): string {
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

function getStatusClass(status: string): string {
  return String(status).toLowerCase().replace(" ", "-");
}

function getPriorityClass(priority: string): string {
  return String(priority).toLowerCase();
}

function renderTasks(): void {
  const taskCards = tasks.map((task) => {
    const isLongDescription =
      task.description.length > DESCRIPTION_PREVIEW_LENGTH;
    //This checks whether the current Id is part of the expandedTaskIds
    //Is the current taskId part of the expanded task Ids?
    const isExpanded = expandedTaskIds.includes(task.id);
    //This decides what text will actually appear on the card
    //It is the version of the description that should be visible right now
    const visibleDescription =
      //This checks whether the description is long AND if it is not expanded
      //Line 133 means the description is long and, the user has not opened it yet.
      isLongDescription && !isExpanded
        ? //If the description is long and the it has not expanded
          //Show the shorter version
          //Otherwise show the complete description
          //Slice means to cut a string from a starting point to another
          //In this case slice starts from 0 and ends at the preview limit, then it adds the three dots at the end
          `${task.description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}....`
        : task.description;
    if (editingTaskId === task.id) {
      return `
      <article class="todo-card todo-card-editing" data-testid="test-todo-card" data-task-id="${task.id}">
        <div class="todo-card__content">
          <form class="edit-form" data-testid="test-todo-edit-form">
            <div class="edit-form__top">
              <div class="edit-form__left">
                <div class="edit-form__heading">
                  <label class="edit-field" for="edit-title-${task.id}">
                    <span>Change title</span>
                    <input
                      id="edit-title-${task.id}"
                      type="text"
                      data-testid="test-todo-edit-title-input"
                      placeholder="Enter task title"
                      value="${task.title}"
                    />
                  </label>

                  <label class="edit-field" for="edit-priority-${task.id}">
                    <span>Change priority</span>
                    <select
                      id="edit-priority-${task.id}"
                      data-testid="test-todo-edit-priority-select"
                    >
                      <option value="Low" ${task.priority === "Low" ? "selected" : ""}>Low</option>
                      <option value="Medium" ${task.priority === "Medium" ? "selected" : ""}>Medium</option>
                      <option value="High" ${task.priority === "High" ? "selected" : ""}>High</option>
                    </select>
                  </label>
                </div>

                <label class="edit-field" for="edit-description-text-area-${task.id}">
                  <span>Change description</span>
                  <textarea
                    id="edit-description-text-area-${task.id}"
                    data-testid="test-todo-edit-description-input"
                    placeholder="Enter text description"
                  >${task.description}</textarea>
                </label>
              </div>

              <label class="edit-field edit-field--date" for="edit-due-date-${task.id}">
                <span>Change due date</span>
                <input
                  type="datetime-local"
                  id="edit-due-date-${task.id}"
                  data-testid="test-todo-edit-due-date-input"
                  value="${new Date(task.dueDate).toISOString().slice(0, 16)}"
                />
              </label> 
            </div>

            <div class="edit-form__actions">
              <button
                type="button"
                data-testid="test-todo-save-button"
                id="save-edit-${task.id}"
                data-task-id="${task.id}"
              >
                Save changes
              </button>
              <button
                type="button"
                data-testid="test-todo-cancel-button"
                id="cancel-edit-${task.id}"
                data-task-id="${task.id}"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </article> `;
    }

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
                  <span
                  class="todo-priority-indicator ${getPriorityClass(task.priority)}"
                  data-testid="test-todo-priority-indicator">
                  
                  </span>
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
                ${task.status === "Done" ? "Completed" : getTimeRemaining(task.dueDate)}
              </span>
            </div>
          </div>

          <div
            id="todo-description-section-${task.id}"
            class="todo-collapsible-section"
            data-testid="test-todo-collapsible-section"
          >
            <p
              class="todo-description"
              data-testid="test-todo-description"
            >
              ${visibleDescription}
            </p>
          </div>
    ${
      isLongDescription
        ? `
        <button
        class="todo-expand-toggle"
        type="button"
        data-testid="test-todo-expand-toggle"
        aria-expanded=${isExpanded}
        aria-controls="todo-description-section-${task.id}"
        data-task-id="${task.id}"
        >
        ${isExpanded ? "Show less" : "Show more"}
        </button>
        `
        : ""
    }
          

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

            <label class="todo-status-control-label">
  <span>Status:</span>

  <select
    class="todo-status-control"
    data-testid="test-todo-status-control"
    data-task-id="${task.id}"
  >
    <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>
      Pending
    </option>

    <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>
      In Progress
    </option>

    <option value="Done" ${task.status === "Done" ? "selected" : ""}>
      Done
    </option>
  </select>
</label>

            <button
              id="edit-button"
              class="todo-button"
              type="button"
              data-testid="test-todo-edit-button"
              data-task-id="${task.id}"
            >
              Edit
            </button>

            

            <button
              class="todo-button"
              type="button"
              data-testid="test-todo-delete-button"
               data-task-id="${task.id}"
            >
              Delete
            </button>
          </div>
        </div>
        
      </article> `;
  });

  todoList.innerHTML = taskCards.join("");

  connectCompleteToggles();
  connectStatusControls();
  connectExpandToggles();
  connectEditButtons();

  //In simple terms this function means
  //Find all Show more / Show less buttons
  //When clicked, get the task id
  //If that is not expanded, add it to the expanded list
  //If it is already expanded, remove it from the expanded list.
  //Redraw the cards
  function connectExpandToggles() {
    const expandButtons = document.querySelectorAll(
      `[data-testid="test-todo-expand-toggle"]`,
    );

    //This line loops through each element in the expandButtons and performs an action of on each of them
    //button is just a temporary name
    expandButtons.forEach((button) => {
      //On clicking any button run the code inside the function
      button.addEventListener("click", (): void => {
        //The line below converts a string task Id into a number
        //It is converted because the task objects in the first lines of code uses numbers not strings
        const taskId = Number((button as HTMLElement).dataset.taskId);
        //The code below checks whether the task id is inside the array
        //if expandedTaskIds = [1, 3];
        //and taskId = 3;
        //expandedTaskIds.indexOf(3) returns 1 because the arrays count from zero
        //if expandedTaskIds.indexOf(3) returns -1, it means the value was not found in the array
        //It simply returns the index of an expandedTaskId
        const existingIndex = expandedTaskIds.indexOf(taskId);
        //The code below means if this task is not currently expanded
        //add it to expandedTaskIds
        //Otherwise remove it from expandedTaskIds
        if (existingIndex === -1) {
          //push() means to add a value to the end of an array
          //e.g if expandedTaskIds = []; taskId = 2 expandedTaskId.push(2), now expanedTaskIds[2] after pushing
          expandedTaskIds.push(taskId);
          //the else block means that the task is already expanded, so clicking the button should collapse it
          //It runs if the task id was already found
          //splice() means starting at this index, remove one time
          //splice(start_index, 1(i.e one item))
          //e.g expandedTaskIds = [1, 2, 3];
          //taskId = 2;
          //existingIndex = 1;
          //expandedTaskIds.splice(1, 1);
          //This removes the item at index 1
        } else {
          expandedTaskIds.splice(existingIndex, 1);
        }

        renderTasks();
      });
    });
  }
}

function connectCompleteToggles(): void {
  const toggles = document.querySelectorAll(
    '[data-testid="test-todo-complete-toggle"]',
  );
  toggles.forEach((toggle: Element) => {
    toggle.addEventListener("change", (): void => {
      const taskId = Number((toggle as HTMLElement).dataset.taskId);
      //tasks refers to the global array of task objects, each containing specific properties
      //find() is an array method that searches through tasks and returns the first object
      //The condition (task) => task.id ===taskId is an arrow function that checks if the current
      //task's id property equals the taskId equals the taskId extracted from the toggle's data attribute
      //Its purpose is to locate the specific task object in the tasks array that corresponds to the toggle being interacted with.
      //If no match is found, task becomes undefined. This step links the UI element back to the data model
      const task = tasks.find((t: Task) => t.id === taskId);

      //This exits the callback function without executing any further code,
      //It checks if the task did not loacte any matching tasks
      //It is a defensive check to prevent errors, such as trying to access properties on a non-existent object
      //It ensures the code only proceeds if a valid task was found, avoiding potential runtime crashes
      if (!task) return;

      //toggle.checked is a boolean property of the HTML checkbox input element(true, if the box is checked, false if unchecked)
      //task.completed directly assigns the boolean value to the completed property of the found task object
      //Its purpose is synchronize the task's internal completion state with the current state of the UI toggle.
      //For example if the user checks the box, the task completed becomes true
      task.completed = (toggle as HTMLInputElement).checked;
      //This assigns task.status to either "Done" or "Pending" if toggle.checked is true.
      task.status = (toggle as HTMLInputElement).checked ? "Done" : "Pending";

      renderTasks();
    });
  });
}

// function editTask(taskId: number) {
//   editingTaskId = taskId;
//   renderTasks();
// }

// function deleteTask(taskId: number) {
//   alert(`Delete clicked for task ${taskId}`);
// }

renderTasks();

function connectEditButtons(): void {
  const saveButtons = document.querySelectorAll(
    '[data-testid="test-todo-save-button"]',
  );
  const cancelButtons = document.querySelectorAll(
    '[data-testid="test-todo-cancel-button"]',
  );

  const editButtons = document.querySelectorAll(
    `[data-testid="test-todo-edit-button"]`,
  );

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = Number((button as HTMLElement).dataset.taskId);
      editingTaskId = taskId;
      renderTasks();
    });
  });

  const deleteButtons = document.querySelectorAll(
    `[data-testid="test-todo-delete-button"]`,
  );

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      taskIdToDelete = Number((button as HTMLElement).dataset.taskId);

      deleteDialog.showModal();
    });
  });

  //This loops through each button in the editable mode in each task card
  saveButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      //This is done so the browser can know the particular task that the save changes will be made
      const taskId = Number((button as HTMLElement).dataset.taskId);
      console.log("Save clicked");
      //Searches the tasks array of objects to find the particular task to save changes
      const task = tasks.find((task) => task.id === taskId);
      if (!task) return;

      const title = (
        document.getElementById(`edit-title-${taskId}`) as HTMLInputElement
      ).value;
      const description = (
        document.getElementById(
          `edit-description-text-area-${taskId}`,
        ) as HTMLTextAreaElement
      ).value;
      const dueDateRaw = document.getElementById(
        `edit-due-date-${taskId}`,
      ) as HTMLInputElement;
      const priority = (
        document.getElementById(`edit-priority-${taskId}`) as HTMLSelectElement
      ).value as Task["priority"];

      const dueDate = dueDateRaw.value
        ? new Date(dueDateRaw.value).toISOString()
        : task.dueDate;

      try {
        const response = await fetch(`http://localhost:8000/todos/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, dueDate, priority }),
        });

        if (!response.ok) throw new Error(`PATCH failed: ${response.status}`);

        editingTaskId = null;
        await fetchTodos();
      } catch (error) {
        console.error("Failed to save task", error);
      }
    });
  });

  cancelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      editingTaskId = null;
      renderTasks();
    });
  });
}

function connectStatusControls() {
  const statusControls = document.querySelectorAll(
    '[data-testid="test-todo-status-control"]',
  );

  statusControls.forEach((control: Element) => {
    control.addEventListener("change", (): void => {
      const taskId = Number((control as HTMLSelectElement).dataset.taskId);
      const task = tasks.find((task: Task) => task.id === taskId);

      if (!task) return;

      task.status = (control as HTMLSelectElement).value as Task["status"];
      task.completed = (control as HTMLSelectElement).value === "Done";

      renderTasks();
    });
  });
}

// const editForm = document.querySelectorAll(".edit-form");
// editForm.addEventListener("submit", function (event) {
//   event.preventDefault();
// });

setInterval(() => {
  if (editingTaskId === null) {
    renderTasks();
  }
}, 30000);
