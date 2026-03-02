"use strict"

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
  const coins = await getCoins();
  console.log(coins);
  

  let bodyCoins = document.querySelector('.tracker-body');
  bodyCoins.innerHTML = '';

  let result = '';
  coins.forEach((elem) => {
    let coinHtml = templateEngine(elem);
    result += coinHtml;
  });
  bodyCoins.innerHTML = result;
}

init();
