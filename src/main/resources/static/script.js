const API = "/api/tasks";


// Load tasks when page opens
window.onload = loadTasks;


// Get all tasks
function loadTasks() {

    fetch(API)
        .then(response => response.json())
        .then(tasks => {

            const list =
                document.getElementById("taskList");

            list.innerHTML = "";

            tasks.forEach(task => {
                displayTask(task);
            });

        })
        .catch(error => {

            showMessage(
                "Unable to load tasks",
                true
            );

        });
}


// Add task
function addTask() {

    const title =
        document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();


    if (title === "") {

        showMessage(
            "Task title is required",
            true
        );

        return;
    }


    if (title.length < 3) {

        showMessage(
            "Title must contain at least 3 characters",
            true
        );

        return;
    }


    const task = {

        title: title,

        description: description,

        completed: false
    };


    fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(task)

    })
    .then(response => {

        if (!response.ok) {
            throw new Error();
        }

        return response.json();

    })
    .then(() => {

        document.getElementById("title").value = "";

        document.getElementById("description").value = "";

        showMessage("Task added successfully");

        loadTasks();

    })
    .catch(() => {

        showMessage(
            "Unable to add task",
            true
        );

    });
}


// Display task
function displayTask(task) {

    const list =
        document.getElementById("taskList");


    const div =
        document.createElement("div");


    div.className =
        task.completed
            ? "task completed"
            : "task";


    div.innerHTML = `

        <h3>${task.title}</h3>

        <p>${task.description || ""}</p>

        <p>
            Status:
            ${task.completed ? "Completed" : "Pending"}
        </p>

        <div class="actions">

            <button
                class="complete"
                onclick="completeTask(${task.id})">

                Complete

            </button>


            <button
                class="edit"
                onclick="editTask(${task.id},
                                  '${escapeQuotes(task.title)}',
                                  '${escapeQuotes(task.description || "")}',
                                  ${task.completed})">

                Edit

            </button>


            <button
                class="delete"
                onclick="deleteTask(${task.id})">

                Delete

            </button>

        </div>
    `;


    list.appendChild(div);
}


// Complete task
function completeTask(id) {

    fetch(`${API}/${id}/complete`, {

        method: "PUT"

    })
    .then(response => {

        if (!response.ok) {
            throw new Error();
        }

        loadTasks();

    })
    .catch(() => {

        showMessage(
            "Unable to complete task",
            true
        );

    });
}


// Edit task
function editTask(
    id,
    oldTitle,
    oldDescription,
    completed
) {

    const title =
        prompt(
            "Enter new task title:",
            oldTitle
        );


    if (title === null) {
        return;
    }


    if (title.trim().length < 3) {

        showMessage(
            "Title must contain at least 3 characters",
            true
        );

        return;
    }


    const description =
        prompt(
            "Enter new description:",
            oldDescription
        );


    const task = {

        title: title.trim(),

        description:
            description || "",

        completed: completed
    };


    fetch(`${API}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(task)

    })
    .then(response => {

        if (!response.ok) {
            throw new Error();
        }

        return response.json();

    })
    .then(() => {

        showMessage(
            "Task updated successfully"
        );

        loadTasks();

    })
    .catch(() => {

        showMessage(
            "Unable to update task",
            true
        );

    });
}


// Delete task
function deleteTask(id) {

    if (!confirm("Delete this task?")) {
        return;
    }


    fetch(`${API}/${id}`, {

        method: "DELETE"

    })
    .then(response => {

        if (!response.ok) {
            throw new Error();
        }

        showMessage(
            "Task deleted successfully"
        );

        loadTasks();

    })
    .catch(() => {

        showMessage(
            "Unable to delete task",
            true
        );

    });
}


// Message
function showMessage(text, error = false) {

    const message =
        document.getElementById("message");

    message.textContent = text;

    message.style.color =
        error ? "red" : "green";


    setTimeout(() => {

        message.textContent = "";

    }, 3000);
}


// Prevent basic quote problems
function escapeQuotes(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}