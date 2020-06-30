// TODO grow todoItem when hovered
// TODO dblick to edit todoItem
// TODO create edit box with one button
// TODO add "enter" event listener that runs validateform func
// TODO add  button click event listener that runs validateform func

// * ^^ https://javascript.info/task/sliding-menu

// * Selectors
let body = document.querySelector("body");
let unsortedList = document.createElement("ul");
let todoInput = document.querySelector(".todoInput");
let todoContainer = document.querySelector(".todoContainer");
let todoBtn = document.querySelector(".todoBtn");
let todoDropdown = document.querySelector(".todoDropdown");
todoContainer.appendChild(unsortedList);
let editableTodoForm = document.createElement("form");
let editableTodoInput = document.createElement("input");
let editBtn = document.createElement("button");

editableTodoForm.appendChild(editableTodoInput);
editableTodoForm.appendChild(editBtn);

// * Listeners

if (document.readyState !== "loading") {
    getTodos();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        getLocalTodos();
    });
}
// document.addEventListener("DomContentLoaded", getLocalTodos());
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
    // ! Prevents form from submitting
    event.preventDefault();
    if (duplicateLocalTodo(todoInput.value) != "dupl") {
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
    // ! Prevents form from submitting
    let editIcon = event.target;
    event.preventDefault();
    // * Creates Todo that contains Check Trash and Submitted Input and Append to UL

    let parentForm = editIcon.parentElement;
    let todoBody = parentForm.parentElement;

    //* Change Previous Text to Current Text
    if (duplicateLocalTodo(editableTodoInput.value) != "dupl") {
        parentForm.classList.remove("inputError");
        //  TODO -- Add our edit in sub of currentAdds our current Input to Local Storage
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
    todoItem.appendChild(editableTodoForm);
    editableTodoForm.classList.remove("inputError");
    editableTodoForm.classList.add("editableForm");
    editableTodoInput.classList.add("editableInput");
    editableTodoForm.setAttribute("onsubmit", "return editForm()");
    editableTodoForm.setAttribute("name", "editForm");
    editableTodoInput.setAttribute("name", "edit");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add("editBtn");

    editBtn.setAttribute("type", "submit");
    editableTodoInput.setAttribute("type", "text");
    if (todoItem.classList[0] === "todoItem") {
        editableTodoInput.value = todoItem.childNodes[0].textContent;
        editBtn.addEventListener("click", editForm);
        todoContainer.addEventListener("focusout", removeEditTodo);
        body.addEventListener("focusout", removeEditTodo);
    }
}
function removeEditTodo(event) {
    editableTodoForm.remove();
}

function filterTodo(event) {
    let todos = unsortedList.childNodes;
    todos.forEach(function (todo) {
        switch (event.target.className) {
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
        // savedTodo;
        todoDiv.appendChild(todoItem);
        // * Adds Edit Listener to only our LI
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
        let status = savedTodo.todoStatus;
        if (status === "completed") {
            todoDiv.classList.toggle("completed");
        }
        if (status === "trashed") {
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
    if (todos[index].todoStatus === "uncompleted") {
        todos[index].todoStatus = "trashed";
        localStorage.setItem("todos", JSON.stringify(todos));
    } else if (todos[index].todoStatus === "trashed") {
        removeLocalTodos(todo);
        // TODO Figure out how this works? \/\/
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
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].todo === todoInput) {
            return "dupl";
        }
    }
}

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
    // if (todos[index].todo === editTodo) {
    //     return "dupl";
    // } else {
    todos[index].todo = editTodo;
    localStorage.setItem("todos", JSON.stringify(todos));
    //* Pushes todo into array Todos then creates JSON object with key todos and value array todos
    // }
}
// TODO remove section
