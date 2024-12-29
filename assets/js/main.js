// Task Management System

// Task Class to manage task data
class Task {
    constructor(id, name, description, dueDate, status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
    }
}

class TaskManager {
    static API_URL = 'controllers/TaskController.php';  // Updated path to be relative to index.php

    static async getAllTasks() {
        try {
            const response = await fetch(this.API_URL);
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    }

    static async createTask(taskData) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            const data = await response.json();
            console.log('Create task response:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error creating task:', error);
            return { message: 'Failed to create task' };
        }
    }

    static async updateTask(taskData) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
            return { message: 'Failed to update task' };
        }
    }

    static async deleteTask(taskId) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: taskId })
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting task:', error);
            return { message: 'Failed to delete task' };
        }
    }
}

class UI {
    static elements = {
        radioViewOptions: document.querySelectorAll("input[name='view-option']"),
        listView: document.getElementById("list-view"),
        boardView: document.getElementById("board-view"),
        addTaskCTA: document.getElementById("add-task-cta"),
        setTaskOverlay: document.getElementById("set-task-overlay"),
        closeButtons: document.querySelectorAll(".close-button"),
        statusSelect: document.getElementById("status-select"),
        statusDropdown: document.getElementById("status-dropdown"),
        viewTaskOverlay: document.getElementById("view-task-overlay"),
        deleteTaskCTA: document.getElementById("delete-task-cta"),
        notification: document.getElementById("notification"),
        taskForm: document.getElementById("taskForm"),
        todoList: document.querySelector(".pink .tasks-list"),
        doingList: document.querySelector(".blue .tasks-list"),
        doneList: document.querySelector(".green .tasks-list")
    };

    static init() {
        console.log('Initializing UI...'); // Debug log
        if (!this.elements.taskForm) {
            console.error('Task form not found!'); // Debug log
            return;
        }
        this.setupEventListeners();
        this.loadTasks();
    }

    static setupEventListeners() {
        console.log('Setting up event listeners...'); // Debug log

        // View switching
        this.elements.radioViewOptions.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleViewChange(e));
        });

        // Add task button
        if (this.elements.addTaskCTA) {
            this.elements.addTaskCTA.addEventListener('click', () => {
                console.log('Add task button clicked'); // Debug log
                this.elements.setTaskOverlay.classList.remove('hide');
                document.body.classList.add('overflow-hidden');
            });
        } else {
            console.error('Add task button not found!'); // Debug log
        }

        // Close buttons
        this.elements.closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeOverlays());
        });

        // Status dropdown
        if (this.elements.statusSelect) {
            this.elements.statusSelect.addEventListener('click', () => {
                this.elements.statusDropdown.classList.toggle('hide');
            });
        }

        // Status radio buttons
        document.querySelectorAll('input[name="status-option"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.elements.statusSelect.querySelector('span').textContent = e.target.value;
                this.elements.statusDropdown.classList.add('hide');
            });
        });

        // Form submission
        if (this.elements.taskForm) {
            console.log('Adding submit event listener to form'); // Debug log
            this.elements.taskForm.addEventListener('submit', (e) => {
                console.log('Form submitted'); // Debug log
                this.handleFormSubmit(e);
            });
        }

        // Delete task
        if (this.elements.deleteTaskCTA) {
            this.elements.deleteTaskCTA.addEventListener('click', () => this.deleteTask());
        }

        // Click outside status dropdown to close
        document.addEventListener('click', (e) => {
            if (!this.elements.statusSelect.contains(e.target) && 
                !this.elements.statusDropdown.contains(e.target)) {
                this.elements.statusDropdown.classList.add('hide');
            }
        });
    }

    static async handleFormSubmit(e) {
        e.preventDefault();
        console.log('Handling form submission...'); // Debug log
        
        // Get form values
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const day = document.getElementById('due-date-day').value.padStart(2, '0');
        const month = document.getElementById('due-date-month').value.padStart(2, '0');
        const year = document.getElementById('due-date-year').value;
        const status = document.querySelector('input[name="status-option"]:checked').value;

        console.log('Form values:', { name, description, day, month, year, status }); // Debug log

        // Create task data object
        const taskData = {
            name: name,
            description: description,
            due_date: `${year}-${month}-${day}`, // Format date for MySQL (YYYY-MM-DD)
            status: status
        };

        try {
            let response;
            const editTaskId = e.target.dataset.editTaskId;

            if (editTaskId) {
                // Update existing task
                taskData.id = editTaskId;
                response = await TaskManager.updateTask(taskData);
                console.log('Update task response:', response); // Debug log

                if (response.message === 'Task updated') {
                    await this.loadTasks();
                    this.closeOverlays();
                    this.showNotification('Task updated successfully!', 'green-background');
                    // Reset form to add mode
                    e.target.dataset.editTaskId = '';
                    e.target.querySelector('button[type="submit"]').textContent = 'Add Task';
                    e.target.querySelector('button[type="submit"]').className = 'button regular-button green-background cta-button';
                    this.elements.setTaskOverlay.querySelector('.header').textContent = 'Add Task';
                } else {
                    this.showNotification('Failed to update task: ' + response.message, 'pink-background');
                }
            } else {
                // Create new task
                response = await TaskManager.createTask(taskData);
                console.log('Create task response:', response); // Debug log

                if (response.message === 'Task created') {
                    await this.loadTasks();
                    this.closeOverlays();
                    this.showNotification('Task added successfully!', 'green-background');
                } else {
                    this.showNotification('Failed to add task: ' + response.message, 'pink-background');
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
            this.showNotification('Failed to save task: ' + error.message, 'pink-background');
        }
    }

    static async loadTasks() {
        console.log('Loading tasks...'); // Debug log
        const tasks = await TaskManager.getAllTasks();
        console.log('Tasks loaded:', tasks); // Debug log
        this.renderTasks(tasks);
    }

    static handleViewChange(event) {
        const viewOption = event.target.value;
        if (viewOption === 'list') {
            this.elements.boardView.classList.add('hide');
            this.elements.listView.classList.remove('hide');
        } else {
            this.elements.listView.classList.add('hide');
            this.elements.boardView.classList.remove('hide');
        }
    }

    static closeOverlays() {
        this.elements.setTaskOverlay.classList.add('hide');
        this.elements.viewTaskOverlay.classList.add('hide');
        document.body.classList.remove('overflow-hidden');
        if (this.elements.taskForm) {
            this.elements.taskForm.reset();
        }
    }

    static createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.taskId = task.id;
        
        li.innerHTML = `
            <button class="task-button">
                <div>
                    <p class="task-name">${task.name}</p>
                    <p class="task-due-date">Due on ${task.due_date}</p>
                </div>
                <iconify-icon
                    icon="material-symbols:arrow-back-ios-rounded"
                    style="color: black"
                    width="18"
                    height="18"
                    class="arrow-icon">
                </iconify-icon>
            </button>
        `;

        li.querySelector('.task-button').addEventListener('click', () => this.viewTask(task));
        return li;
    }

    static renderTasks(tasks) {
        console.log('Rendering tasks:', tasks); // Debug log
        // Clear existing tasks
        if (this.elements.todoList) this.elements.todoList.innerHTML = '';
        if (this.elements.doingList) this.elements.doingList.innerHTML = '';
        if (this.elements.doneList) this.elements.doneList.innerHTML = '';

        // Render tasks in appropriate lists
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            switch(task.status) {
                case 'To do':
                    if (this.elements.todoList) this.elements.todoList.appendChild(taskElement);
                    break;
                case 'Doing':
                    if (this.elements.doingList) this.elements.doingList.appendChild(taskElement);
                    break;
                case 'Done':
                    if (this.elements.doneList) this.elements.doneList.appendChild(taskElement);
                    break;
            }
        });
    }

    static viewTask(task) {
        const overlay = this.elements.viewTaskOverlay;
        
        // Set task data
        overlay.querySelector('.header.no-margin').textContent = task.name;
        overlay.querySelector('.value').textContent = task.description;
        overlay.querySelectorAll('.value')[2].textContent = task.due_date;
        
        const statusValue = overlay.querySelector('.status-value');
        statusValue.innerHTML = `
            <span class="circle ${this.getStatusColor(task.status)}-background"></span>
            <span>${task.status}</span>
        `;

        // Add edit button
        const editButton = document.createElement('button');
        editButton.className = 'button regular-button blue-background';
        editButton.textContent = 'Edit Task';
        editButton.onclick = () => this.showEditTaskForm(task);

        // Add buttons container if it doesn't exist
        let buttonsContainer = overlay.querySelector('.buttons-container');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';
            overlay.appendChild(buttonsContainer);
        }

        // Clear existing buttons and add new ones
        buttonsContainer.innerHTML = '';
        buttonsContainer.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'button regular-button pink-background';
        deleteButton.textContent = 'Delete Task';
        deleteButton.onclick = () => this.deleteTask();
        buttonsContainer.appendChild(deleteButton);

        overlay.classList.remove('hide');
        document.body.classList.add('overflow-hidden');
        
        // Store current task ID
        overlay.dataset.currentTaskId = task.id;
    }

    static showEditTaskForm(task) {
        const overlay = this.elements.setTaskOverlay;
        const form = this.elements.taskForm;

        // Set form title
        overlay.querySelector('.header').textContent = 'Edit Task';

        // Fill form with task data
        form.querySelector('#name').value = task.name;
        form.querySelector('#description').value = task.description;

        // Parse date
        const [year, month, day] = task.due_date.split('-');
        form.querySelector('#due-date-year').value = year;
        form.querySelector('#due-date-month').value = parseInt(month);
        form.querySelector('#due-date-day').value = parseInt(day);

        // Set status
        const statusRadio = form.querySelector(`input[value="${task.status}"]`);
        if (statusRadio) {
            statusRadio.checked = true;
            this.elements.statusSelect.querySelector('span').textContent = task.status;
        }

        // Change form submit button
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = 'Update Task';
        submitButton.className = 'button regular-button blue-background cta-button';

        // Store task ID in form
        form.dataset.editTaskId = task.id;

        // Show edit form
        this.elements.viewTaskOverlay.classList.add('hide');
        overlay.classList.remove('hide');
    }

    static async deleteTask() {
        const taskId = parseInt(this.elements.viewTaskOverlay.dataset.currentTaskId);
        const response = await TaskManager.deleteTask(taskId);
        
        if (response.message === 'Task deleted') {
            await this.loadTasks();
            this.closeOverlays();
            this.showNotification('Task deleted successfully!', 'green-background');
        } else {
            this.showNotification('Failed to delete task: ' + response.message, 'pink-background');
        }
    }

    static showNotification(message, colorClass) {
        const notification = this.elements.notification;
        notification.querySelector('p').textContent = message;
        notification.className = `notification ${colorClass}`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    static getStatusColor(status) {
        switch(status) {
            case 'To do': return 'pink';
            case 'Doing': return 'blue';
            case 'Done': return 'green';
            default: return 'pink';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    UI.init();
});
