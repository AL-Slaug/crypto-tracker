"use strict"

const menuBurger = document.getElementById('burger');
const menuNavigator = document.querySelector(".header-nav")

menuBurger.addEventListener('click', showMenu);

function showMenu() {
  menuBurger.classList.toggle('active');
  menuNavigator.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
}