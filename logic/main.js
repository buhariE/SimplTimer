// Retrieve elements from DOM
const themeToggleWrapper = document.querySelector('.themeToggleWrapper');
const themeToggleCircle = document.querySelector('.themeToggleCircle');
const hourToggleCircle = document.querySelector('.hourToggleCircle');
const contentCardsContainer = document.querySelector('.contentCards');
let theme = 'dark';
let hourFormat = '12H';
const translateXvalue = 345;
let contentCardMovement = 0;
let max = 0;
let min = -(2*translateXvalue);
const menuItems = document.querySelectorAll('.menuItem');

// functions
function toggleTheme() {
    if (theme === 'dark') {
        theme = 'light';
        themeToggleCircle.style.transform = 'translateX(24px)';
        themeToggleCircle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        theme = 'dark';
        themeToggleCircle.style.transform = 'translateX(0px)';
        themeToggleCircle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}
function toggleFormat() {
    if (hourFormat === '12H') {
        hourFormat = '24H';
        hourToggleCircle.style.transform = 'translateX(23px)';
        hourToggleCircle.innerHTML = '24H';
    } else {
        hourFormat = '12H';
        hourToggleCircle.style.transform = 'translateX(0px)';
        hourToggleCircle.innerHTML = '12H';
    }
}

function moveCards(index){
    contentCardMovement = -(index * translateXvalue);
    contentCardsContainer.style.transform = `translateX(${contentCardMovement}px)`;
    menuItems.forEach((item, idx) => {
        if(idx === index){
            item.classList.add('activeMenu');
        } else {
            item.classList.remove('activeMenu');
        }
    });
}