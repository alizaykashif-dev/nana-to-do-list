
// HTML ELEMENTS


const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const rewardTicket = document.getElementById("rewardTicket");
const ticketStatus = document.getElementById("ticketStatus");



// TASK DATA


let tasks = [];



// SAVE TASKS


function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}



// LOAD TASKS


function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

    }

}



// DISPLAY A TASK


function displayTask(taskData) {

    const task = document.createElement("div");

    task.classList.add("task");


    // Create the task HTML

    task.innerHTML = `
        <input type="checkbox">

        <label>${taskData.text}</label>

        <button class="edit-button">EDIT</button>

        <button class="delete-button">×</button>
    `;


    // Get the elements we just created

    const checkbox = task.querySelector("input");

    const label = task.querySelector("label");

    const editButton = task.querySelector(".edit-button");

    const deleteButton = task.querySelector(".delete-button");


    // Restore completed state

    checkbox.checked = taskData.completed;


    // Make completed tasks look crossed out

    if (taskData.completed) {

        label.style.textDecoration = "line-through";

        label.style.opacity = "0.5";

    }



    // CHECKBOX
 

    checkbox.addEventListener("change", function () {

        taskData.completed = checkbox.checked;


        if (checkbox.checked) {

            label.style.textDecoration = "line-through";

            label.style.opacity = "0.5";

        } else {

            label.style.textDecoration = "none";

            label.style.opacity = "1";

        }


        saveTasks();

        updateProgress();

    });


 
    // DELETE TASK
  

    deleteButton.addEventListener("click", function () {

        // Find this task in the array

        const taskIndex = tasks.indexOf(taskData);


        // Remove it from the array

        tasks.splice(taskIndex, 1);


        // Remove it from the webpage

        task.remove();


        // Save the new task list

        saveTasks();


        // Recalculate progress

        updateProgress();

    });


    // EDIT TASK
  

    editButton.addEventListener("click", function () {

        const newTaskText = prompt(
            "Edit your task:",
            taskData.text
        );


        // If the user cancels

        if (newTaskText === null) {
            return;
        }


        // Remove unnecessary spaces

        const cleanedText = newTaskText.trim();


        // Don't allow an empty task

        if (cleanedText === "") {
            return;
        }


        // Update the task data

        taskData.text = cleanedText;


        // Update what is displayed

        label.textContent = cleanedText;


        // Save the change

        saveTasks();

    });


    // Add task to the page

    taskList.appendChild(task);

}



// ADD TASK


addTask.addEventListener("click", function () {

    const taskText = taskInput.value.trim();


    // Don't add empty tasks

    if (taskText === "") {
        return;
    }


    // Create task object

    const taskData = {

        text: taskText,

        completed: false

    };


    // Add it to our array

    tasks.push(taskData);


    // Display it

    displayTask(taskData);


    // Save it

    saveTasks();


    // Clear input

    taskInput.value = "";


    // Update progress

    updateProgress();

});



// PRESS ENTER TO ADD TASK


taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addTask.click();

    }

});



// UPDATE PROGRESS


function updateProgress() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        function (task) {
            return task.completed === true;
        }
    ).length;


    // If there are no tasks

    if (totalTasks === 0) {

        progressFill.style.width = "0%";

        progressText.textContent = "0%";

        rewardTicket.classList.add("locked");

        ticketStatus.textContent =
            "🔒 COMPLETE YOUR SETLIST";

        return;

    }


    // Calculate percentage

    const progress =
        (completedTasks / totalTasks) * 100;


    // Update progress bar

    progressFill.style.width =
        progress + "%";


    // Update percentage

    progressText.textContent =
        Math.round(progress) + "%";


   
    // TRAPNEST REWARD
   

    if (progress === 100) {

        rewardTicket.classList.remove("locked");

        ticketStatus.textContent =
            "★ SETLIST COMPLETE — ENJOY THE SHOW ★";

    } else {

        rewardTicket.classList.add("locked");

        ticketStatus.textContent =
            "🔒 COMPLETE YOUR SETLIST";

    }

}


// LOAD EVERYTHING WHEN PAGE OPENS


loadTasks();


tasks.forEach(function (taskData) {

    displayTask(taskData);

});


updateProgress();