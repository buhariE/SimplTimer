// Retrieve elements from DOM
const themeToggleWrapper = document.querySelector('.themeToggleWrapper');
const themeToggleCircle = document.querySelector('.themeToggleCircle');
const hourToggleCircle = document.querySelector('.hourToggleCircle');

const contentCardsContainer = document.querySelector('.contentCards');

const timezoneDropDopdownBtn = document.querySelector('.timeZoneDropDown');
const timezoneDropDopdownContent = document.querySelector('.timezoneBackDrop');
const timezoneDropDopdownClose = document.querySelector('.closeBtn');
const menuItems = document.querySelectorAll('.menuItem');

const timerSideButtons = document.querySelectorAll('.timerSideButtons div');


// init global variables
let theme = 'dark';
let hourFormat = '12H';
const translateXvalue = 345;
let contentCardMovement = 0;
let max = 0;
let min = -(2*translateXvalue);

// functions
function toggleTheme() {
    if (theme === 'dark') {
        theme = 'light';
        themeToggleCircle.style.transform = 'translateX(24px)';
        themeToggleCircle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        document.documentElement.style.setProperty('--primary-color', '#f0f0f0');
        document.documentElement.style.setProperty('--secondary-color', '#4a4a4a');
        document.documentElement.style.setProperty('--text-color', '#323232ff');
        document.documentElement.style.setProperty('--accent-color1', '#2a8ad8ff');
        document.documentElement.style.setProperty('--accent-color2', '#064d33ff');
    } else {
        theme = 'dark';
        themeToggleCircle.style.transform = 'translateX(0px)';
        themeToggleCircle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        document.documentElement.style.setProperty('--primary-color', '#2b2b2b');
        document.documentElement.style.setProperty('--secondary-color', '#d9d9d9');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--accent-color1', '#0078DBff');
        document.documentElement.style.setProperty('--accent-color2', '#00311Fff');
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

function closeBackDrop(){
    timezoneDropDopdownContent.style.display = 'none';
}

function closeBackDropOnClickOutside(e){
    const child = timezoneDropDopdownContent.children[0];
    if(e.clientX >= child.offsetLeft && e.clientX <= (child.offsetLeft + child.offsetWidth) &&
       e.clientY >= child.offsetTop && e.clientY <= (child.offsetTop + child.offsetHeight)){
        return;
    }
    closeBackDrop();
}

function openBackDrop(){
    timezoneDropDopdownContent.style.display = 'flex';
}

function displayTime(){
    
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ampm = '';
    if(hourFormat === '12H'){
        ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    } else {
        ampm = 'HRS';
    }

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    const hoursDiv = document.querySelector('.timeHours');
    hoursDiv.innerText = hours;
    const minutesDiv = document.querySelector('.timeMinutes');
    minutesDiv.innerText = minutes;
    const secondsDiv = document.querySelector('.timeSeconds');
    secondsDiv.innerText = seconds;
    const ampmDiv = document.querySelector('.timePeriod');
    ampmDiv.innerText = ampm;

    setTimeout(displayTime, 1000);
}

displayTime();

function incrementTime(type){
    switch(type){
        case 'hours':
            incrementTimeDisplay(0,23,document.querySelector('.timerHours .value .digits'));
            break;
        case 'minutes':
            incrementTimeDisplay(0,59,document.querySelector('.timerMinutes .value .digits'));
            break;
        case 'seconds':
            incrementTimeDisplay(0,59,document.querySelector('.timerSeconds .value .digits'));
            break;
    }
    enableTimerPlaySideButtons();
}
function decrementTime(type){
    switch(type){
        case 'hours':
            decrementTimeDisplay(0,23,document.querySelector('.timerHours .value .digits'));
            break;
        case 'minutes':
            decrementTimeDisplay(0,59,document.querySelector('.timerMinutes .value .digits'));
            break;
        case 'seconds':
            decrementTimeDisplay(0,59,document.querySelector('.timerSeconds .value .digits'));
            break;
    }
    enableTimerPlaySideButtons();
}

function incrementTimeDisplay(min,max,element){
    let value = parseInt(element.innerText);
    if(value < max){
        value += 1;
    } else {
        value = max;
    }
    element.innerText = value < 10 ? '0' + value : value;
}

function decrementTimeDisplay(min,max,element,update){
    let value = parseInt(element.innerText);
    if(value > min){
        value -= 1;
    } else {
        value = min;
    }
    element.innerText = value < 10 ? '0' + value : value;
}

function enableTimerPlaySideButtons(){

    const timerHours = parseInt(document.querySelector('.timerHours .value .digits').innerText);
    const timerMinutes = parseInt(document.querySelector('.timerMinutes .value .digits').innerText);
    const timerSeconds = parseInt(document.querySelector('.timerSeconds .value .digits').innerText);
    if(timerHours > 0 || timerMinutes > 0 || timerSeconds >= 10){
        
        timerSideButtons[1].classList.remove('disabled');
        timerSideButtons[1].removeAttribute('aria-disabled');
        timerSideButtons[1].addEventListener('click', countDown);
        timerSideButtons[2].classList.remove('disabled');
        timerSideButtons[2].removeAttribute('aria-disabled');

    } else {

        timerSideButtons.forEach(button => {
            button.classList.add('disabled');
            button.setAttribute('aria-disabled', 'true');
            button.removeEventListener('click',countDown);
        });
        
    }

}

let intervalIdCtDwn;
function countDown(){

    const timerHoursDigits = document.querySelector('.timerHours .value .digits');
    const timerMinutesDigits = document.querySelector('.timerMinutes .value .digits');
    const timerSecondsDigits = document.querySelector('.timerSeconds .value .digits');

    
    if (timerSideButtons[1].classList.contains('stop')){

        
        timerSideButtons[1].classList.remove('stop');
        timerSideButtons[1].innerHTML = '<i class="fa-solid fa-play"></i>';
        
        enableTimerPlaySideButtons();
        
        clearInterval(intervalIdCtDwn);

    } else {

        timerSideButtons[1].classList.add('stop');
        timerSideButtons[1].innerHTML = '<i class="fa-solid fa-stop"></i>';

        timerSideButtons[2].classList.add('disabled');
        timerSideButtons[2].setAttribute('aria-disabled','true');

        intervalIdCtDwn = setInterval(countDownTime, 1000, 0, timerSecondsDigits, 59, timerMinutesDigits, timerHoursDigits,intervalIdCtDwn,function(){
            timerSideButtons[1].classList.remove('stop');
            timerSideButtons[1].innerHTML = '<i class="fa-solid fa-play"></i>';

            enableTimerPlaySideButtons();
        });
        
    }
    



}


function countDownTime(min,secs,max,mins,hrs,id,fallbackf){

    let seconds  = parseInt(secs.innerText);
    let minutes = parseInt(mins.innerText);
    let hours = parseInt(hrs.innerText);

    // count down for seconds when greater than zero
    if(seconds > min){
        seconds -=1;
        secs.innerText =seconds < 10?'0'+seconds:seconds;
    } else { // count down for seconds when less than zero

        if(minutes > 0){ // check minutes
            minutes -= 1;
            seconds = max;
        } else if(minutes === 0 & hours > 0) { // check minutes and hours
            minutes = max;
            seconds = max;
            hours -= 1;
        } else { // if hrs =0, mins =0, and secs = 0.
            clearInterval(intervalIdCtDwn);
            fallbackf();
        }
        // update DOM element.
        hrs.innerText = hours < 10?'0'+hours:hours;
        mins.innerText = minutes < 10 ? '0'+minutes:minutes;
        secs.innerText =seconds < 10?'0'+seconds:seconds;

    }
}


