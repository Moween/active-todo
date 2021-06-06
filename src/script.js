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
  // displayTodo(todosCopy);
}

// // Creates HTML Elements
// class CreateTodo {
//   constructor(todo) {
//     //Create a div element to house the task, duration, button elements
//     this.taskWrap = document.createElement('div');  
//     this.taskWrap.className = 'task-wrap';
  
//     //Create p Element
//     const taskName = document.createElement('p');
//     //Add textContent to the p element
//     taskName.textContent = `${todo.task}`;
//     if(todo.completed === true) {
//       taskName.className = 'completed';
//     }else {
//       taskName.classList.remove('completed');
//     }
    
//     //Create checkboxBtn
//     const checkedBtn = document.createElement('button');
//     checkedBtn.className = ('btn btn-default btn-xs checked-btn');
//     checkedBtn.innerHTML = '<i class="fas fa-check"></i>';
//     checkedBtn.setAttribute('data-id', todo.id);
    
//     // Create delete button
//     const deleteBtn = document.createElement('button');
//     deleteBtn.setAttribute("type","button");
//     deleteBtn.className = ('btn btn-danger btn-xs delete deletebtn');
//     deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
//     deleteBtn.setAttribute('data-id', todo.id);
    
//     this.handleTickEvents = this.handleTickEvents.bind(this);
//     this.handleDeleteTodo = this.handleDeleteTodo.bind(this);
    
//     // Add EventListener to  btn
//     deleteBtn.onclick = this.handleDeleteTodo;
//     checkedBtn.onclick = this.handleTickEvents;
    
//     this.taskWrap.append(taskName, checkedBtn, deleteBtn);
//   }

//   handleTickEvents = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     let todos = localStorage.getItem('myTodoList');
//     todos = JSON.parse(todos);
//     todos = todos.map(todo => {
//       if(todo.id === e.currentTarget.dataset.id)  {
//         todo.completed = (todo.completed === true  ? false : true);
//       }
//       return todo;
//     });  
//     todosCopy = [...todos];
    
//     // Reset local storage
//     localStorage.setItem('myTodoList', JSON.stringify(todos));
//     displayTodo(todosCopy);
//   }


//   handleDeleteTodo = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const { currentTarget: { dataset: { id: deleteItem } } } = e;
//     let todos = localStorage.getItem('myTodoList');
//     todos = JSON.parse(todos);
  
//     //Delete from local storage
//     todos = todos.filter(todo => todo.id !== deleteItem);
//     todosCopy = [...todos];
  
//     // Reset Local Storage
//     localStorage.setItem('myTodoList', JSON.stringify(todos));
  
//     // Delete from DOM
//     displayTodo(todosCopy);
//   }
// }

// // Display message if no list is available
// const displayNoTodoMessage = (e) => {
//   const p = document.createElement('p');
//   if(e.target.id === 'uncompleted' || e.target.id === 'completed') {
//     if(!todosCopy.length) {
//       p.textContent = `No task to perform. Input a task.`;
//       p.style.margin = '10px';
//       document.querySelector('#todo-list').append(p);
//     } else {
//       p.textContent = `Tick completed task.`;
//       p.style.margin = '10px';
//       document.querySelector('#todo-list').append(p);
//     }
//   }
// }

// // Display Todo
// const displayTodo = (todosArr) => {
//   todoList.innerHTML = '';
//   todosArr.forEach(todo => {
//     const { taskWrap } = new CreateTodo(todo);   
//     document.querySelector('#todo-list').append(taskWrap);
//   })
// }

// const filterTodos = (e) => {
//   e.preventDefault();
//   todoList.innerHTML = '';
//   let filteredTodos;
//   switch(e.target.id) {
//     case 'all':      
//       displayTodo(todosCopy);
//       break;
//     case 'completed':
//       filteredTodos = todosCopy.filter(todosObj => todosObj.completed === true);
//       if(filteredTodos.length) {
//         displayTodo(filteredTodos);
//         todoList.insertAdjacentText('afterbegin', 'Completed task');
//       }else {
//         displayNoTodoMessage(e); 
//       }
//       break;
//     case 'uncompleted': 
//       filteredTodos = todosCopy.filter(todosObj => !todosObj.completed);
//       if(!filteredTodos.length) {
//         displayNoTodoMessage(e); 
//       }else {
//         displayTodo(filteredTodos);
//         todoList.insertAdjacentText('afterbegin', 'Uncompleted task');
//       }
//       break;
//   } 
// }

// const displayUnCompletedTask = (e) => {
//   filterTodos(e); 
// }

// const displayCompletedTask = (e) => {
//   filterTodos(e);
// }

// const displayAllTask = (e) => {
//   filterTodos(e);
// }


// displayTodo(todosCopy);
// // Add Event Listener
// bgColorIcon.addEventListener('click', toggleBgMode)
taskInput.addEventListener('click', clearInput);
taskInput.addEventListener('change', handleSubmitTodos);

