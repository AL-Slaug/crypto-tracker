"use strict"

import { getCoins, templateEngine } from "./api.js";


let allCoins = [];
let displayCoins = [];

let currentPage = 1;
let perPage = 20;


// Переключатель направления сортировки
let isAscending = true;

const menuBurger = document.getElementById('burger');
const menuNavigator = document.querySelector(".header-nav")

menuBurger.addEventListener('click', showMenu);

function showMenu() {
  menuBurger.classList.toggle('active');
  menuNavigator.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
};


async function init() {
  console.log('init called');
  try {
    allCoins = await getCoins();
    displayCoins = allCoins;
    renderPage();
    
  } catch (error) {
    console.error(error)
    document.querySelector('.tracker-body').innerHTML = '<p style="color: red; padding: 20px">Error loading data. Please try again later.</p>';
  }
};

init();

setInterval(() => {
  if (!document.hidden) {
    init()
  }
}, 60000);

function renderTable(data) {
    let bodyCoins = document.querySelector('.tracker-body');
    bodyCoins.innerHTML = '';

  let result = '';
  data.forEach((elem) => {
    let coinHtml = templateEngine(elem);
    result += coinHtml;
  });

  bodyCoins.innerHTML = result;
};

const searchInput = document.querySelector('#search');

searchInput.addEventListener('input', () => {
   let searchValue = searchInput.value.toLowerCase(); 
   displayCoins = allCoins.filter((coin) => {
      return coin.name.toLowerCase().includes(searchValue) || coin.symbol.toLowerCase().includes(searchValue);
   });
   currentPage = 1;
   renderPage();
});

let trackerHeader = document.querySelector('.tracker-header');
trackerHeader.addEventListener('click', sortHeader);

// Главная функция обработки кликов по заголовкам таблицы
function sortHeader(event) {
  let target = event.target.closest('.tracker-header__col[data-type]');
  if (!target) return;

  const headArrow = document.querySelectorAll('.sort-arrow');
  headArrow.forEach((elem) => {
    elem.classList.remove('up', 'down');
  })

  
  const type = target.dataset.type;
  isAscending = !isAscending;
  target.querySelector('.sort-arrow').classList.add(isAscending ? 'up' : 'down');

  displayCoins.sort((a, b) => {
    const valA = a[type];
    const valB = b[type];

    if (type === 'name') {
      return isAscending ? valA.localeCompare(valB, 'en') : valB.localeCompare(valA, 'en');
    }

    return isAscending ? valA - valB : valB - valA;
  })

  renderPage();
}

function renderPage() {
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  let arrTable = displayCoins.slice(start, end);
  
  renderTable(arrTable);

  renderPagination();

}


const list = document.querySelector('.num-list');
list.addEventListener('click', changePage);


function renderPagination() {
   console.log('renderPagination called, currentPage:', currentPage);
  const maxPage = Math.ceil(displayCoins.length / perPage);
  list.innerHTML = '';
  
  list.innerHTML += '<button class="arrow-left"><</button>';
  for (let i = 1; i <= maxPage; i++){
    list.innerHTML +=`<button class="number">${i}</button>`
  };
  list.innerHTML += '<button class="arrow-right">></button>';
  
  const num = list.querySelectorAll('.number');
  const arrowLeft = list.querySelector('.arrow-left');
  const arrowRight = list.querySelector('.arrow-right');
  
  num.forEach(elem => {
    if (elem.textContent === String(currentPage)) {
      elem.classList.add('active');
    }
  })
  
  if (currentPage === 1) arrowLeft.classList.toggle('disabled');
  
  
  if (currentPage === maxPage) arrowRight.classList.toggle('disabled'); 
}

function changePage(event) {
  const maxPage = Math.ceil(displayCoins.length / perPage);
  let target = event.target;
  if (target.tagName !== 'BUTTON') return; 

  if (target.classList.contains('arrow-left')) {
     currentPage--;
  } else if (target.classList.contains('arrow-right')) {
     currentPage++;
  } else {
     currentPage = Number(target.textContent);
  }

  if (currentPage < 1) currentPage = 1;
  if (currentPage > maxPage) currentPage = maxPage; 

  renderPage();
}
