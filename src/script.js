// Variables
const header = document.getElementById('#header');
const bgColorIcon = document.getElementById('bg-mode');
const taskInput = document.querySelector('#task');
const todoList = document.querySelector('#todo-list');
const main = document.querySelector('#main')
const darkMode = 'images/icon-moon.svg#icon-moon';
const lightMode = 'images/icon-sun.svg#icon-sun';
// Toggle Background
// const toggleBgMode = (e) => {
//   e.preventDefault();
//   e.stopPropagation();
//   console.log(main.style.backgroundColor);
//   main.style.backgroundColor = 
//     (main.style.backgroundColor === 'hsl(0, 0%, 98%)' ?
//       'hsl(235, 21%, 11%)' :
//       'hsl(0, 0%, 98%)'
//   );
// }

// Global todos: A copy of our local storage data
let todosListCopy = localStorage.getItem('todosList');
if(todosListCopy) {
  todosListCopy = JSON.parse(todosListCopy);
}else {
  todosListCopy = [];
  //Set local storage key to (todosList)
  localStorage.setItem('todosList', JSON.stringify([]));
}

// Clears Input
const clearInput = (e) => {
  e.preventDefault();
  document.querySelector(`#${e.target.id}`).value = '';
}

class ToDo {
  constructor(newTodo) {
    this.task = newTodo.task;
    this.id = newTodo.id;
    this.completed = false;
  }
}

// // Add to localStorage
const handleSubmitTodos = (e) =>  {
  e.preventDefault();

  let newTodo = {};
  newTodo.task = e.target.value;
  console.log(newTodo.task)
  newTodo.id = Date.now().toString();

  // Instantiate a todo object
  const myTodo = new ToDo(newTodo);
  // Get 'todos arr' from local storage
  let todos = localStorage.getItem('todosList');
  todos = JSON.parse(todos);
  // Todo to push to local storage
  todos.push({ task, id, completed } = myTodo); 
  // Update the global todosArr (todosCopy)whuch is a copy of local storage data
  todosListCopy = [...todos];
  // Rest local storage
  localStorage.setItem('todosList', JSON.stringify(todos));
  displayTodo(todosListCopy);
}

class TodoElements {
  constructor(todo) {
    this.li = document.createElement('li');
    this.li.className = 'list-item'
    const label = document.createElement('label');
    label.setAttribute('for', todo.id);
    this.li.append(label);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('id', todo.id);
    checkbox.type = 'checkbox';
    checkbox.name = 'todo';
    checkbox.className = 'checkbox-round';
    this.li.append(checkbox);
    this.li.appendChild(document.createTextNode(todo.task));
    const deletebtn = document.createElement('button');
    deletebtn.setAttribute('data-id', todo.id)
    deletebtn.type = "button";
    deletebtn.textContent = 'X';
    deletebtn.classList = 'btn btn-sm btn-default delete-btn';
    this.li.append(deletebtn);
  }
}


const displayTodo = (todosArr) => {
  const ulElem = document.querySelector('#todo-list')
  ulElem.innerHTML = '';
  const divContainer = document.querySelector('.div');

  if(!todosArr.length) {
    divContainer.style.display = 'none';
  }else {
    divContainer.style.display = 'block';
    todosArr.forEach(todo => {
      const { li } = new TodoElements(todo);
      ulElem.append(li); 
    });
  }    
} 

displayTodo(todosListCopy);
taskInput.addEventListener('click', clearInput);
taskInput.addEventListener('change', handleSubmitTodos);

