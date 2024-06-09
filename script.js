// Selectors
const alert = document.querySelector('.alert')
const form = document.querySelector('#form');
const input = document.querySelector('#form-input');
const result = document.querySelector('.result');
const resultList = document.querySelector('.result-list');
const clear = document.querySelector('.clear');
const submitBtn = document.querySelector('#submit')

// global variables

let edit = false;
let editElement;
let editId = '' ;

// Event Listeners
window.addEventListener('DOMContentLoaded',setUpItems)
form.addEventListener('submit', addNote);
clear.addEventListener('click', clearItems);


// Functions

function addNote(e) {
    e.preventDefault();
    const value = input.value;
    const id = new Date().getTime().toString();
    if (value !== '' && !edit) {
        const element = document.createElement('article');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add('result-list-article');
        element.innerHTML = `
      <p class="title">${value}</p>
      <div class="btn-container">
          <!-- edit and delete button -->
          <button class="edit-btn">
              <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn">
              <i class="fas fa-trash-alt"></i>
          </button>
      </div>
      `
    //   Appending child and show result
   
      resultList.appendChild(element);
      result.classList.add('show-result')

      showAlert('Item added successfully', 'success')

    // Event listener on edit and delete button
    const editBtn = document.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem);
    const deleteBtn = document.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem);
    
    // Add to localStorage
    addToLocalStorage(id,value)
    // clear
    setBackToDefault();
}

    else if (input.value !== '' && edit) {
        editElement.innerHTML = value;
        showAlert('Item edited successfully', 'success')
        editToLocalStorage(editId,value)
        setBackToDefault();
    } else {
        showAlert('Please enter a value to add', 'danger')
    }
}

function showAlert(message, type) {
    alert.innerHTML = `${message}`
    alert.classList.add(`alert-${type}`)

    setTimeout(function () {
        alert.innerHTML = ``
        alert.classList.remove(`alert-${type}`)
        
    },2000)
}

function clearItems() {
    const item = document.querySelectorAll('.result-list-article');
    if(item.length > 0){
        item.forEach(function(items){
            resultList.removeChild(items)
        })
        result.classList.remove('show-result')
        showAlert('all items cleared','danger')
        setBackToDefault();
        localStorage.removeItem('list')
    }
}

function setBackToDefault (){
    edit = false;
    editElement;
    editId = '';
    input.value = '';
    submitBtn.innerHTML = 'Add'
}


function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    input.value = editElement.innerHTML;
    edit = true;
    submitBtn.innerHTML = 'Edit';
    editId = element.dataset.id;
}

function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
  
    resultList.removeChild(element);
  
    if (resultList.children.length === 0) {
      result.classList.remove("show-result");
    }
    showAlert("item removed", "danger");
  
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// get LocalStorage
function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')):[];
}

function addToLocalStorage(id,value){
    const result = {id,value}
    let item = getLocalStorage();

    item.push(result)
    localStorage.setItem('list',JSON.stringify(item))
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
          if(item.id !== id){
            return item
          }
    })
    localStorage.setItem('list',JSON.stringify(items))
}

function editToLocalStorage (id,value){
    let item = getLocalStorage();

    item = item.map(function(items){
        if(items.id === id){
            items.value = value
        }
        return items
    })
    localStorage.setItem('list',JSON.stringify(item))
}

function setUpItems(){
    const items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id,item.value)
        })
        result.classList.add('show-result')
    }
}

function createListItem(id , value){
        const element = document.createElement('article');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add('result-list-article');
        element.innerHTML = `
      <p class="title">${value}</p>
      <div class="btn-container">
          <button class="edit-btn">
              <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn">
              <i class="fas fa-trash-alt"></i>
          </button>
      </div>
      `
    //   Appending child and show result
      resultList.appendChild(element);
    // Event listener on edit and delete button
    document.querySelector('.edit-btn').addEventListener('click', editItem);
    document.querySelector('.delete-btn').addEventListener('click', deleteItem);
}