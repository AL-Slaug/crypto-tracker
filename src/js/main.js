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


function closestList(event, element, trigger) {
  if (!trigger.contains(event.target)) {
    element.classList.remove('active');
  }
}


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
  const maxPage = Math.ceil(displayCoins.length / perPage);
  list.innerHTML = '';

  list.innerHTML += `<button class="arrow-left ${currentPage === 1 ? 'disabled' : ''}"><</button>`;
  for (let i = 1; i <= maxPage; i++){
    list.innerHTML += `<button class="number ${i === currentPage ? 'active' : ''}">${i}</button>`
  };
  list.innerHTML += `<button class="arrow-right ${currentPage === maxPage ? 'disabled' : ''}">></button>`;
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

const dropdownBtn = document.querySelector('.dropdown__btn')
dropdownBtn.addEventListener('click', eventsDropdown);
const dropdownList = document.querySelector('.dropdown__list')
dropdownList.addEventListener('click', selectionDropdown);
const dropdownArrow = document.querySelector('.dropdown__arrow');

document.body.addEventListener('click', (event) => { closestList(event, dropdownList, dropdownBtn)
  dropdownList.classList.contains('active') ? dropdownArrow.classList.add('open') : dropdownArrow.classList.remove('open');
});

function eventsDropdown() {
  dropdownBtn.classList.toggle('active');
  dropdownList.classList.toggle('active');

  if (!dropdownList.classList.contains('active')) return;
  
  let positionBtn = dropdownBtn.getBoundingClientRect();
  let positionList = dropdownList.getBoundingClientRect();

  if (positionBtn.bottom + positionList.height >  document.documentElement.clientHeight) {
    dropdownList.style.top = 'auto';
    dropdownList.style.bottom = '100%';
  } else {
    dropdownList.style.top = '100%';
    dropdownList.style.bottom = 'auto';
  }
}

const hiddenElement = document.querySelector('.tracker-header');

function selectionDropdown(event) {
  perPage = +event.target.dataset.value;
  hiddenElement.scrollIntoView({behavior: "smooth"})
  dropdownBtn.firstChild.textContent = perPage;

  
  renderPage(perPage);
}