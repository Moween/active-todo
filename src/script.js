// Variables
const header = document.querySelector('header');
const bgColorIcon = document.querySelector('#header-icon');
const taskInput = document.querySelector('#task');
const ulElem = document.querySelector('#todo-list');
const todoCard = document.querySelector('.todo-card');
const divContainer = document.querySelector('.todocard-div');



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
  if(typeof newTodo.task === 'string') {
    newTodo.task = newTodo.task
      .slice(0, 1).toUpperCase() + newTodo.task.slice(1);
  }else {
    return newTodo.task;
  }
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
    this.li.classList = 'list-item-lightmode';

    // Label
    const label = document.createElement('label');
    label.setAttribute('for', 'todos');
    this.li.append(label);

    //Checkbox
    const checkbox = document.createElement('input');
    checkbox.setAttribute('id', 'todos');
    checkbox.type = 'checkbox';
    checkbox.name = 'todo';
    checkbox.className = 'checkbox-round-lightmode';
    checkbox.onchange = this.checkItem;
    checkbox.setAttribute('data-id', todo.id);
    this.li.append(checkbox);

    //li text content
    this.li.appendChild(document.createTextNode(todo.task));
    
    (todo.completed === true ?
       this.li.classList.add('completed'):
       this.li.classList.remove('completed')
    );

    // Delete Button
    const deletebtn = document.createElement('button');
    deletebtn.type = "button";
    deletebtn.innerHTML = `
      <img data-id='${todo.id}' style="width:13px" 
        src="/images/icon-cross.svg" 
        alt="delete-icon" 
      />`;
    deletebtn.classList = 'btn btn-sm delete-btn-light';
    deletebtn.onclick = this.deleteItem;
    this.li.append(deletebtn);
    this.deleteItem = this.deleteItem.bind(this);
    this.checkItem = this.checkItem.bind(this);
  }

  deleteItem(e) {
    e.preventDefault();
    e.stopPropagation();
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
    displayTodo(todosListCopy);
    showUncompleted();
    hideClearCompleted();
  }
}

class linksTags {
  constructor() {
    this.li = document.createElement('li');
    const divElem = document.createElement('div');
    divElem.className = 'inner-todocard-div';
    const p = document.createElement('p');
    p.className = 'item';
    divElem.append(p);
    const p2 = document.createElement('p');
    p2.innerHTML = `
    <a  
      href="#" 
      id='clear-completed'
    >
      clear completed
    </a>`;
    p2.onclick = this.handleClearCompleted;
    divElem.append(p2);
    
    // Div Container
    let divContainerHeight = 
      window.getComputedStyle(divContainer).getPropertyValue("height");
    divContainerHeight = divContainerHeight.replace(/\px/, '');
    divContainerHeight = parseInt(divContainerHeight);
    console.log(divContainerHeight);

    // Nav
    const nav = document.createElement('div');
    nav.className = 'nav';

    // Set nav absolute from the top
    nav.style.top = divContainerHeight + 60 + 'px';
    nav.innerHTML = `
      <a href="#" id="all">all</a>
      <a href="#" id="active">active</a>
      <a href="#" id="completed">completed</a>`;
    divElem.append(nav);
    nav.onclick = this.handleAnchorClick;
    nav.onclick = this.filterTodos;    
    this.li.append(divElem);
    this.handleClearCompleted = this.handleClearCompleted.bind(this)
    this.filterTodos = this.filterTodos.bind(this);
  }

  handleClearCompleted = (e) => {
    e.preventDefault();
    let todos = localStorage.getItem('todosList');
    todos = JSON.parse(todos);
  
    todos = todos.filter(todo => todo.completed === false);
    todosListCopy = [...todos];
  
    // Reset localStorage
    localStorage.setItem('todosList', JSON.stringify(todos));  
    displayTodo(todosListCopy);
  }

  filterTodos = (e) => {
    e.preventDefault();
    const msg = document.createElement('p');
    switch(e.target.id) {
      case 'all':
        displayTodo(todosListCopy);
        break;
        case 'active':
          const activeTodos = todosListCopy.filter(todos => todos.completed === false);
          if(!activeTodos.length) {
            ulElem.innerHTML = '';
            msg.textContent = 'No active task.'
            msg.style.textAlign = 'center';
          ulElem.append(msg);
          document.querySelector('#clear-completed').style.display = 'none';
        }
        displayTodo(activeTodos);
        break;
      case 'completed':
        const completedTodos = todosListCopy.filter(todo =>  todo.completed === true);
        if(!completedTodos.length) {
          ulElem.innerHTML = '';
          msg.textContent = '';
          msg.textContent = 'No completed task.'
          msg.style.textAlign = 'center';
          ulElem.append(msg);
          document.querySelector('#clear-completed').style.display = 'none';
        }
        displayTodo(completedTodos);
        break;
      default:
    }
  }
}

const displayTodo = (todosArr) => {
  ulElem.innerHTML = '';

  if(!todosArr.length) {
    todoCard.style.display = 'none';
  }else {
    todoCard.style.display = 'block';
    todosArr.forEach(todo => {
      const { li } = new TodoElements(todo);
      ulElem.append(li); 
    });
    const { li } = new linksTags();
    ulElem.append(li);
    showUncompleted();
    hideClearCompleted();
  } 
} 

const showUncompleted = () => {
  const itemsText = document.querySelector('.item');
  const pElem = document.querySelector('.inner-todocard-div p');
  const numOfUncompleted = todosListCopy.filter(todo => todo.completed === false);
  if(!numOfUncompleted.length) {
    pElem.style.display = 'none';
  }else {
    pElem.style.display = 'block';
    itemsText.textContent = (numOfUncompleted.length === 1) ?
    `${numOfUncompleted.length} item left`: 
    `${numOfUncompleted.length} items left`;
  }
}

const hideClearCompleted = () => {
  clearCompletedBtn = document.querySelector('#clear-completed');
  const numOfCompleted = todosListCopy.filter(todo => todo.completed === true);
  if(!numOfCompleted.length) {
    clearCompletedBtn.style.display = 'none' 
  }else {
    clearCompletedBtn.style.display = 'block';
  }
}

// Toggle Background
const toggleBgMode = (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log(e.target.src)

  // Change HeaderImg
    header.classList.toggle('darkmode-header-bg-img');

  // Change bg-header-icon
  const darkModeIcon = `/images/icon-sun.svg`;
  const lightModeIcon =  `/images/icon-moon.svg`;
  e.target.src = 
    (e.target.src  === lightModeIcon ? darkModeIcon : lightModeIcon);
  
  // Toggle body background color
  document.body.classList.toggle('darkmode');

  // Toggle Inputbar class
  taskInput.classList.toggle('inputbar-darkmode');

  //Change div container
  divContainer.classList.toggle('todocard-div-darkmode');


  const clearCompleted = document.getElementById('#clear-completed')
  clearCompleted.style = 
    (clearCompleted.style === 'hsl(233, 14%, 35%)') ? 
      'hsl(233, 11%, 84%)': 
      'hsl(233, 14%, 35%)';
  // Toggle checkboxes class
  const checkboxes = document.querySelectorAll('.checkbox-round-lightmode');
  for(let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].classList.toggle('checkbox-round-darkmode');
  }

  // Toggle Deletebtn Class
  const deleteBtns = document.querySelectorAll('.delete-btn-light');
  for(let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].classList.toggle('delete-btn-dark');
  } 

  const listItems = document.querySelectorAll('.list-item-lightmode');
  for(let i = 0; i < listItems.length; i++) {
    listItems[i].classList.toggle('list-item-darkmode');
  }

  document.querySelector('.nav').classList.toggle('nav-darkmode')
}


displayTodo(todosListCopy);
bgColorIcon.addEventListener('click', toggleBgMode);
taskInput.addEventListener('click', clearInput);
taskInput.addEventListener('change', handleSubmitTodos);

