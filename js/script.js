'use strict';

class Todo {
	constructor(form, input, todoList, todoCompleted) {
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.todoList = document.querySelector(todoList);
		this.todoCompleted = document.querySelector(todoCompleted);
		this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
	}

	generateKey() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	render() {
		this.todoList.textContent = '';
		this.todoCompleted.textContent = '';
		this.todoData.forEach(this.createItem, this);
		this.addToStorage();
	}

	deleteItem(key) {
		this.todoData.forEach(item => {
			if (item.key === key) {
				this.todoData.delete(item.key);
			}
			this.render();
		});
	}

	completedItem(key) {
		this.todoData.forEach(item => {
			if (item.key === key) {
				item.completed = true;
			}
			this.render();
		});
	}

	handler() {
		const todoContainer = document.querySelector('.todo-container');
		todoContainer.addEventListener('click', event => {
			const target = event.target;

			if (!target.matches('.todo-remove, .todo-complete')) {
				return;
			}

			if (target.matches('.todo-remove')) {
				this.deleteItem(target.closest('li').key);
			} else if (target.matches('.todo-complete')) {
				this.completedItem(target.closest('li').key);
			}
		});
	}

	addToStorage() {
		localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
	}

	createItem(todo) {
		const li = document.createElement('li');
		li.classList.add('todo-item');
		li.key = todo.key;
		li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);
		if (todo.completed) {
			this.todoCompleted.append(li);
		} else {
			this.todoList.append(li);
		}
	}

	addTodo(e) {
		e.preventDefault();
		if (this.input.value.trim() && this.input.value.trim().length > 0) {
			const newTodo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey(),
			};
			this.todoData.set(newTodo.key, newTodo);
			this.render();
		} else {
			alert('Пустое дело добавить нельзя!');
		}
		this.input.value = '';
	}

	init() {
		this.form.addEventListener('submit', this.addTodo.bind(this));
		this.render();
	}
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
todo.handler();
