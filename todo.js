// * Selectors
let body = document.querySelector("body");
let unsortedList = document.createElement("ul");
let todoInput = document.querySelector(".todoInput");
let todoContainer = document.querySelector(".todoContainer");
let todoBtn = document.querySelector(".todoBtn");

let todoDropdown = document.querySelector(".todoDropdown");
let editableTodoForm = document.createElement("form");
let editableTodoInput = document.createElement("input");
let editBtn = document.createElement("button");

todoContainer.appendChild(unsortedList);
editableTodoForm.appendChild(editableTodoInput);
editableTodoForm.appendChild(editBtn);

// * Listeners

if (document.readyState !== "loading") {
    getLocalTodos();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        getLocalTodos();
    });
}
unsortedList.addEventListener("click", deleteItem);
todoBtn.addEventListener("click", validateForm);
todoDropdown.addEventListener("click", filterTodo);

// * Functions
function validateForm(event) {
    event.preventDefault();
    let verify = document.forms["todoForm"]["todo"].value;
    if (verify == "") {
        todoInput.classList.add("inputError");
        todoInput.classList.remove("inputPass");
        todoBtn.classList.add("inputButtonError");
        todoBtn.classList.remove("inputButtonPass");
        return false;
    }
    if (verify != "") {
        todoInput.classList.add("inputPass");
        todoInput.classList.remove("inputError");
        todoBtn.classList.add("inputButtonPass");
        todoBtn.classList.remove("inputButtonError");
        addTodo(event);
        return true;
    }
}
function editForm(event) {
    event.preventDefault();
    let verify = editableTodoInput.value;
    if (verify == "") {
        editableTodoInput.classList.add("editInputError");
        editableTodoInput.classList.remove("editInputPass");
        return false;
    }
    if (verify != "") {
        editableTodoInput.classList.add("editInputPass");
        editableTodoInput.classList.remove("editInputError");
        addEditTodo(event);
        return true;
    }
}

function addTodo(event) {
    // * Prevents form from submitting
    event.preventDefault();
    if (duplicateLocalTodo(todoInput.value) != "duplicate") {
        // * Creates Todo that contains Check Trash and Submitted Input and Append to UL
        let todo = document.createElement("div");
        todo.classList.add("todo");
        unsortedList.appendChild(todo);
        // * Adds our current Input to Local Storage
        saveLocalTodos(todoInput.value);
        // * Create LI
        let todoItem = document.createElement("li");
        todoItem.classList.add("todoItem");
        todoItem.innerText = todoInput.value;
        todo.appendChild(todoItem);
        // * Adds Listener to only our LI Element in case of Editing
        todoItem.addEventListener("click", editTodo);
        // * Create Trash Button
        let trashBtn = document.createElement("button");
        trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
        trashBtn.classList.add("trashBtn");
        todo.appendChild(trashBtn);
        // * Create Complete Button
        let compBtn = document.createElement("button");
        compBtn.innerHTML = '<i class="fas fa-check"></i>';
        compBtn.classList.add("compBtn");
        todo.appendChild(compBtn);

        // * Clear Input field
        todoInput.value = "";
    } else {
        todoInput.classList.add("inputError");
        todoInput.classList.remove("inputPass");
        todoBtn.classList.add("inputButtonError");
        todoBtn.classList.remove("inputButtonPass");
    }
}
function addEditTodo(event) {
    // * Prevents form from submitting
    let editIcon = event.target;
    event.preventDefault();
    // * Creates Todo that contains Check Trash and Submitted Input and Append to UL

    let parentForm = editIcon.parentElement;
    let todoBody = parentForm.parentElement;

    //* Change Previous Text to Current Text
    if (duplicateLocalTodo(editableTodoInput.value) != "duplicate") {
        parentForm.classList.remove("inputError");
        editLocalTodos(todoBody, editableTodoInput.value);
        todoBody.innerText = editableTodoInput.value;
        // * Pushes current variation and removes old variation
    } else if (todoBody.innerText === editableTodoInput.value) {
        parentForm.classList.remove("inputError");
        editLocalTodos(todoBody, editableTodoInput.value);
        todoBody.innerText = editableTodoInput.value;
        // * If Error Throws Error Display up
    } else {
        editableTodoInput.classList.add("editInputError");
        editableTodoInput.classList.remove("editInputPass");
    }
}
function deleteItem(event) {
    let icon = event.target;
    // * Todo Deleter
    if (icon.classList[0] === "trashBtn") {
        //* Grabs todoBody from the icon
        let todoBody = icon.parentElement;
        todoBody.classList.toggle("trashed");
        markTrashed(todoBody);
        // if todoBody.classList
        todoBody.addEventListener("transitionend", function () {
            todoBody.style.display = "none";
        });
    }
    // * Todo Completer
    if (icon.classList[0] === "compBtn") {
        let todoBody = icon.parentElement;
        todoBody.classList.toggle("completed");
        markCompleted(todoBody);
        todoBody.addEventListener("transitionend", function () {
            todoBody.style.display = "none";
        });
    }
}

function editTodo(event) {
    let todoItem = event.target;
    // * Adding Editable Form to clicked on LI Element
    todoItem.appendChild(editableTodoForm);
    // * Adding Classes/Attributes to Form, Input Field, and Button Elements
    editableTodoForm.classList.remove("inputError");
    editableTodoForm.classList.add("editableForm");
    editableTodoInput.classList.add("editableInput");
    editBtn.classList.add("editBtn");
    editableTodoForm.setAttribute("onsubmit", "return editForm()");
    editableTodoForm.setAttribute("name", "editForm");
    editableTodoInput.setAttribute("name", "edit");
    editableTodoInput.setAttribute("type", "text");
    editBtn.setAttribute("type", "submit");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';

    if (todoItem.classList[0] === "todoItem") {
        // * Changes our LI items value to our Input Field
        editableTodoInput.value = todoItem.childNodes[0].textContent;
        // * Adds 3 seperate listeners that Listen for clicking out of target LI or clicking inside target LI's edit Input Field and selecting its Button Element
        editBtn.addEventListener("click", editForm);
        todoContainer.addEventListener("focusout", removeEditTodo);
        body.addEventListener("focusout", removeEditTodo);
    }
}
// * Removes TodoForm Element from targetted LI Element
function removeEditTodo(event) {
    editableTodoForm.remove();
}
// * Category selector
function filterTodo(event) {
    let todos = unsortedList.childNodes;
    // * Iterates thru every single todo
    todos.forEach(function (todo) {
        // * Targets the Category name and switches function targets that specific class
        switch (event.target.className) {
            // * similar to if className === "filterTodo"
            case "filterTodo":
                if (!todo.classList.contains("trashed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "filterCompleted":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "filterUncompleted":
                if (
                    !todo.classList.contains("completed") &&
                    !todo.classList.contains("trashed")
                ) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "filterTrashed":
                if (todo.classList.contains("trashed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(saveTodo) {
    let todos;
    //* Check if already saved
    if (localStorage.getItem("todos") === null) {
        //* Creates initial Array or JSON object
        todos = [];
    } else {
        //* Checks that it is already in localStorage grabs it and turns it back into an array
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    // * Automatically creates element with second value being uncompleted
    let todoItem = {
        todo: saveTodo,
        todoStatus: "uncompleted",
    };
    //* Pushes todo into array Todos then creates JSON object with key todos and value array todos
    todos.push(todoItem);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    //* Check if already saved
    if (localStorage.getItem("todos") === null) {
        //* Creates initial Array or JSON object
        todos = [];
    } else {
        //* Checks that it is already in localStorage grabs it and turns it back into an array
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    //* Pushes todo into array Todos then creates JSON object with key todos and value array todos
    todos.forEach(function (savedTodo) {
        let todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        unsortedList.appendChild(todoDiv);
        // * Create LI
        let todoItem = document.createElement("li");
        todoItem.classList.add("todoItem");
        todoItem.innerText = savedTodo["todo"];
        todoDiv.appendChild(todoItem);
        // * Adds Listener to only our LI Element in case of Editing
        todoItem.addEventListener("click", editTodo);
        // * Create Trash Button
        let trashBtn = document.createElement("button");
        trashBtn.innerHTML = '<i class="fas fa-trash"></i>';
        trashBtn.classList.add("trashBtn");
        todoDiv.appendChild(trashBtn);
        // * Create Complete Button
        let compBtn = document.createElement("button");
        compBtn.innerHTML = '<i class="fas fa-check"></i>';
        compBtn.classList.add("compBtn");
        todoDiv.appendChild(compBtn);
        unsortedList.appendChild(todoDiv);
        // * Creates variable todoStatus that automatically reassigns previous saved LocalStorage status
        let todostatus = savedTodo.todoStatus;
        if (todostatus === "completed") {
            todoDiv.classList.toggle("completed");
        }
        if (todostatus === "trashed") {
            todoDiv.classList.toggle("trashed");
        }
    });
}

function markCompleted(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[0].innerText;
    let index = todos.findIndex((obj) => obj.todo == todoIndex);
    // * Reassigns todoStatus variable to completed if was previously uncompleted
    if (todos[index].todoStatus === "uncompleted") {
        todos[index].todoStatus = "completed";
        localStorage.setItem("todos", JSON.stringify(todos));
    } else {
        todos[index].todoStatus = "uncompleted";
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function markTrashed(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[0].innerText;
    let index = todos.findIndex((obj) => obj.todo == todoIndex);
    // * Reassigns todoStatus variable to trashed if was previously uncompleted
    if (todos[index].todoStatus === "uncompleted") {
        todos[index].todoStatus = "trashed";
        localStorage.setItem("todos", JSON.stringify(todos));
        // * Completely removes todo item from LocalStorage and from HTML
    } else if (todos[index].todoStatus === "trashed") {
        removeLocalTodos(todo);
        todo.remove();
    } else {
        todos[index].todoStatus = "uncompleted";
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoIndex = todo.children[0].innerText;
    let index = todos.findIndex((obj) => obj.todo == todoIndex);
    // * Targets specific todo removes it then updates LocalStorage
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function duplicateLocalTodo(todoInput) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    // * Loops thru entire Todos searching for similar Input Submission, returns duplicate to prevent form submission if found
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].todo === todoInput) {
            return "duplicate";
        }
    }
}
// * Requires old and current Input Submission values
function editLocalTodos(todo, editTodo) {
    let todos;
    //* Check if already saved
    if (localStorage.getItem("todos") === null) {
        //* Creates initial Array or JSON object
        todos = [];
    } else {
        //* Checks that it is already in localStorage grabs it and turns it back into an array
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    // * Finds todoItem text and isolates replaces its value to current
    const todoIndex = todo.innerText;
    let index = todos.findIndex((obj) => obj.todo == todoIndex);
    // * Replaces old todo with edited Todo
    todos[index].todo = editTodo;
    localStorage.setItem("todos", JSON.stringify(todos));
    //* Pushes todo into array Todos then creates JSON object with key todos and value array todos
}
