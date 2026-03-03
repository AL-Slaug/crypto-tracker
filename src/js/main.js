"use strict"

let allCoins = [];

const menuBurger = document.getElementById('burger');
const menuNavigator = document.querySelector(".header-nav")

menuBurger.addEventListener('click', showMenu);

function showMenu() {
  menuBurger.classList.toggle('active');
  menuNavigator.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
}

import { getCoins, templateEngine } from "./api.js";

async function init() {
  allCoins = await getCoins();
  renderTable(allCoins);
}

init();

function renderTable(data) {
    let bodyCoins = document.querySelector('.tracker-body');
    bodyCoins.innerHTML = '';

  let result = '';
  data.forEach((elem) => {
    let coinHtml = templateEngine(elem);
    result += coinHtml;
  });

  bodyCoins.innerHTML = result;
}

const searchInput = document.querySelector('#search');

searchInput.addEventListener('input', () => {
   let searchValue = searchInput.value.toLowerCase(); 
   let filtereCoins = allCoins.filter((coin) => {
      return coin.name.toLowerCase().includes(searchValue) || coin.symbol.toLowerCase().includes(searchValue);
   });
   renderTable(filtereCoins);
});



