// Variables
const header = document.querySelector('header');
const bgColorIcon = document.querySelector('.header-icon');
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

class TodoObj {
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
  const myTodo = new TodoObj(newTodo);
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

class CreateTodo {
  constructor(todo) {
    this.li = document.createElement('li');
    this.li.classList = 'list-item';

    // Label
    const label = document.createElement('label');
    label.setAttribute('for', todo.id);
    
    //Checkbox
    const checkbox = document.createElement('input');
    checkbox.setAttribute('id', todo.id);
    checkbox.type = 'checkbox';
    checkbox.name = 'todo';
    checkbox.onchange = this.handleCheckItem;
    checkbox.setAttribute('data-id', todo.id);
    
    //li text content
    const paragrph = document.createElement('p');
    paragrph.textContent = todo.task;
    paragrph.style.display = 'inline-block'
    paragrph.style.marginLeft = '15px';
    label.appendChild(paragrph);
    this.li.append(checkbox);
    this.li.append(label);
    
    if (todo.completed) {
      paragrph.classList.add('completed');
      checkbox.checked = true;
    }else {
      paragrph.classList.remove('completed');
      checkbox.checked = false;
    }

    // Delete Button
    const deletebtn = document.createElement('button');
    deletebtn.type = "button";
    deletebtn.innerHTML = `
      <img data-id='${todo.id}' style="width:13px" 
        src="../src/images/icon-cross.svg" 
        alt="delete-icon" 
      />`;
    deletebtn.classList = 'btn btn-sm delete-btn-light';
    deletebtn.onclick = this.handleDeleteItem;
    this.li.append(deletebtn);

    // Set the li to draggable
    this.li.draggable = true;
    
    // Drag Event Listener
    this.li.ondragstart = this.handleDragItem;
    this.li.ondrop = this.handleDropItem;
    this.li.ondragover = this.handleDragOverItem;
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleDropItem = this.handleDropItem.bind(this);
    this.handleDragOverItem = this.handleDragOverItem.bind(this);
    this.handleCheckItem = this.handleCheckItem.bind(this);
    this.handleDragItem = this.handleDragItem.bind(this);
  }

  handleDeleteItem(e) {
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

  handleCheckItem(e) {
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

  handleDragItem(e) {
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  }

  handleDropItem(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/html');
    e.target.append(document.getElementById(data));
  }

  handleDragOverItem(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"
  }
}

class TodoLink {
  constructor() {
    this.li = document.createElement('li');
    const divElem = document.createElement('div');
    divElem.className = 'inner-todocard-div';
    const p = document.createElement('p');
    p.className = 'item';
    divElem.append(p);
    const paragrph2 = document.createElement('p');
    paragrph2.innerHTML = `
    <a  
      href="#" 
      id='clear-completed'
    >
      clear completed
    </a>`;
    paragrph2.onclick = this.handleClearCompleted;
    divElem.append(paragrph2);
    // Nav
    const nav = document.createElement('div');
    nav.className = 'nav';

    // Set nav absolute from the top
    nav.style.top = getComputedHeight(60);
    nav.innerHTML = `
      <a href="#" id="all">all</a>
      <a href="#" id="active">active</a>
      <a href="#" id="completed">completed</a>`;

    // Displaying nav for media query
    var displayNav = window.matchMedia("(min-width: 1024px)");
    if(displayNav.matches) {
      divElem.insertBefore(nav, paragrph2);
    }else {
      divElem.append(nav);
    }
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
            e.currentTarget.style.top = getComputedHeight(20);
            ulElem.append(e.currentTarget);
        }else {
          displayTodo(activeTodos);
        }
        break;
      case 'completed':
        const completedTodos = todosListCopy.filter(todo =>  todo.completed === true);
        if(!completedTodos.length) {
          ulElem.innerHTML = '';
          msg.textContent = '';
          msg.textContent = 'No completed task.'
          msg.style.textAlign = 'center';
          ulElem.append(msg);
          e.currentTarget.style.top = getComputedHeight(20);
          ulElem.append(e.currentTarget);
        }else {
          displayTodo(completedTodos);
        }
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
      const { li } = new CreateTodo(todo);
      ulElem.append(li); 
    });
    const { li } = new TodoLink();
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
  clearCompletedBtn = document.querySelector('.inner-todocard-div p:last-of-type');
  const numOfCompleted = todosListCopy.filter(todo => todo.completed === true);
  if(!numOfCompleted.length) {
    clearCompletedBtn.style.display = 'none'; 
  }else {
    clearCompletedBtn.style.display = 'block';
  }
}

// Div Container
const getComputedHeight = (num) => {
  let divContainerHeight = 
    window.getComputedStyle(divContainer).getPropertyValue("height");
  divContainerHeight = divContainerHeight.replace(/\px/, '');
  divContainerHeight = parseInt(divContainerHeight);
  return divContainerHeight + num + 'px';
}

// Toggle Background
const toggleBgMode = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Change HeaderImg
  header.classList.toggle('darkmode-header-bg-img');

  // Change bg-header-icon  
  if(e.target.className === 'header-icon') {
    e.target.className = 'bg-image-darkmode';
  }else {
    e.target.className = 'header-icon';
  }

  // Toggle body background color
  document.body.classList.toggle('darkmode');

  // Toggle Inputbar class
  taskInput.classList.toggle('inputbar-darkmode');

  //Change div container
  divContainer.classList.toggle('todocard-div-darkmode');


  const clearCompleted = document.getElementById('clear-completed')
  if(clearCompleted) 
    clearCompleted.style = 
      (clearCompleted.style === 'hsl(233, 14%, 35%)') ? 
        'hsl(233, 11%, 84%)': 
        'hsl(233, 14%, 35%)';

  const innerDiv = document.querySelector('.inner-todocard-div');
  innerDiv.classList.toggle('inner-todocard-div-darkmode');

  // Toggle Deletebtn Class
  const deleteBtns = document.querySelectorAll('.delete-btn-light');
  if(deleteBtns)
    for(let i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].classList.toggle('delete-btn-dark');
    } 

  const listItems = document.querySelectorAll('.list-item');
  if(listItems)
    for(let i = 0; i < listItems.length; i++) {
      listItems[i].classList.toggle('list-item-darkmode');
    }

  const nav = document.querySelector('.nav');
  if(nav)
    nav.classList.toggle('nav-darkmode'); 
  
}


displayTodo(todosListCopy);
bgColorIcon.addEventListener('click', toggleBgMode);
taskInput.addEventListener('click', clearInput);
taskInput.addEventListener('change', handleSubmitTodos);

