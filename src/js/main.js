"use strict"

let allCoins = [];

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

import { getCoins, templateEngine } from "./api.js";

async function init() {
  allCoins = await getCoins();
  renderTable(allCoins);
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
   let filtereCoins = allCoins.filter((coin) => {
      return coin.name.toLowerCase().includes(searchValue) || coin.symbol.toLowerCase().includes(searchValue);
   });
   renderTable(filtereCoins);
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

  allCoins.sort((a, b) => {
    const valA = a[type];
    const valB = b[type];

    if (type === 'name') {
      return isAscending ? valA.localeCompare(valB, 'en') : valB.localeCompare(valA, 'en');
    }

    return isAscending ? valA - valB : valB - valA;
  })

  renderTable(allCoins);
}

