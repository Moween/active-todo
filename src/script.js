// Variables
const header = document.getElementById('#header');
const bgColorIcon = document.querySelector('.bg-mode-changer');
const taskInput = document.querySelector('#task');
const todoList = document.querySelector('#todo-list');
const allLink = document.querySelector('#all');
const activeLink = document.querySelector('#active');
const completedLink = document.querySelector('#completed');

// Toggle Background
const toggleBgMode = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const header = document.querySelector('#header');
  header.className = 
    (header.className === 'lightmode-header-bg-img' ? 
      'darkmode-header-bg-img' : 
      'lightmode-header-bg-img'
    );

  const main = document.querySelector('#main')
  main.className = 
    (main.className === 'lightmode-bg-color' ? 
      'darkmode-bg-color' : 
      'lightmode-bg-color'
    ); 
  const darkmodeIcon = 
    `<use href="images/icon-moon.svg#icon-moon"></use>`;
  const lightmodeIcon = 
    `<use href="images/icon-sun.svg#icon-sun"></use>;`;

    e.target.innerHTML = 
      (e.target.innerHTML  === darkmodeIcon ? 
        lightmodeIcon :
         darkmodeIcon    
      )
}


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
    label.setAttribute('for', 'todos');
    this.li.append(label);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('id', 'todos');
    checkbox.type = 'checkbox';
    checkbox.name = 'todo';
    checkbox.className = 'checkbox-round';
    checkbox.onchange = this.checkItem;
    checkbox.setAttribute('data-id', todo.id);
    this.li.append(checkbox);
    this.li.appendChild(document.createTextNode(todo.task));
    const deletebtn = document.createElement('button');
    deletebtn.setAttribute('data-id', todo.id);
    deletebtn.type = "button";
    deletebtn.textContent = 'X';
    deletebtn.classList = 'btn btn-sm btn-default delete-btn';
    deletebtn.onclick = this.deleteItem;
    this.li.append(deletebtn);
    this.deleteItem = this.deleteItem.bind(this);
    this.checkItem = this.checkItem.bind(this);
  }

  deleteItem(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.target.dataset.id)
    const { target: { dataset: { id: deleteItemId } } } = e;
    let todos = localStorage.getItem('todosList');
    todos = JSON.parse(todos);

    todos = todos.filter(todo => {
      return todo.id !== deleteItemId;
    })

    todosListCopy = [...todos];

    // Reset Local Storage
    localStorage.setItem('todosList', JSON.stringify(todos));
    displayTodo(todosListCopy);
  }

  checkItem(e) {
    e.preventDefault();
    e.stopPropagation();
    const { target: {dataset: { id: checkedItem } }} = e;
    console.log(e.target.dataset.id)
    let todos = localStorage.getItem('todosList');
    todos = JSON.parse(todos);

    todos = todos.map(todo => {
      if(todo.id === checkedItem) {
        todo.completed = (todo.completed === false ? true : false);
      }
      return todo;
    })

    todosListCopy = [...todos];
    localStorage.setItem('todosList', JSON.stringify(todos));
    showUncompleted();
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
  showUncompleted();
} 

const showUncompleted = () => {
  const itemsText = document.querySelector('#item');
  const itemsCount = document.querySelector('#num-of-uncompleted');
  // itemsText.innerHTML = '';
  const numOfUncompleted = todosListCopy.filter(todo => todo.completed === false);
  itemsCount.textContent = numOfUncompleted.length;
  console.log( document.querySelector('.todocard-div p' ).nodes);
  console.log(numOfUncompleted)
  if(!numOfUncompleted.length) {
    const spanElems = document.querySelectorAll('.todocard-div p > span')
    for(let i = 0; i < spanElems.length; i++) {
      spanElems[i].style.display = 'none';
    }
  }else {
    const spanElems = document.querySelectorAll('.todocard-div p > span')
    for(let i = 0; i < spanElems.length; i++) {
      spanElems[i].style.display = 'block';
    }
    itemsText.textContent = (numOfUncompleted.length === 1) ? 'item' : 'items'
  } 
}

const filterTodos = (e) => {
  e.preventDefault();
  switch(e.target.id) {
    case 'all':
      displayTodo(todosListCopy);
      break;
    case 'active':
      const activeTodos = todosListCopy.filter(todos => todos.completed === false);
      displayTodo(activeTodos);
      break;
    case 'completed':
      const completedTodos = todosListCopy.filter(todo =>  todo.completed === true);
      displayTodo(completedTodos);
      break;
    default:
  }
}

const displayActiveTodos = (e) => {
  filterTodos(e); 
}

const displayCompletedTodos = (e) => {
  filterTodos(e);
}

const displayAllTodos = (e) => {
  filterTodos(e);
}

const handleClearCompleted = (e) => {
  e.preventDefault();
  let todos = localStorage.getItem('todosList');
  todos = JSON.parse(todos);

  todos = todos.filter(todo => todo.completed === false);
  todosListCopy = [...todos];

  // Reset localStorage
  localStorage.setItem('todosList', JSON.stringify(todos));

  displayTodo(todosListCopy);
}

displayTodo(todosListCopy);
bgColorIcon.addEventListener('click', toggleBgMode);
taskInput.addEventListener('click', clearInput);
taskInput.addEventListener('change', handleSubmitTodos);
allLink.addEventListener('click',displayAllTodos);
activeLink.addEventListener('click', displayActiveTodos);
completedLink.addEventListener('click', displayCompletedTodos);
document.querySelector('#clear-completed')
  .addEventListener('click', handleClearCompleted);

