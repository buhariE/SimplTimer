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

function intify(string){
    return string.replaceAll(' ', '') === null?string:string.replaceAll(' ', '');
}

function display11(text){
    return text === 11?'1 1':text;
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
    hours = hours === 11 ? '1 1':hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    minutes = minutes === 11 ? '1 1':minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    seconds = seconds === 11 ? '1 1':seconds;
    
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
    let value = parseInt(intify(element.innerText));
    if(value < max){
        value += 1;
        console.log(value);
    } else {
        value = max;
    }
    
    element.innerText = value < 10 ? '0' + value:display11(value);
}

function decrementTimeDisplay(min,max,element){
    let value = parseInt(intify(element.innerText));
    if(value > min){
        value -= 1;
    } else {
        value = min;
    }
    
    element.innerText = value < 10 ? '0' + value:display11(value);
}

function enableTimerPlaySideButtons(){

    let hrsStr= intify(document.querySelector('.timerHours .value .digits').innerText); 
    let minStr = intify(document.querySelector('.timerMinutes .value .digits').innerText);
    let secsStr = intify(document.querySelector('.timerSeconds .value .digits').innerText);

    let timeArray = [
                     document.querySelector('.timerHours .value .digits'),
                     document.querySelector('.timerMinutes .value .digits'),
                     document.querySelector('.timerSeconds .value .digits')
                    ]

    const timerHours = parseInt(hrsStr);
    const timerMinutes = parseInt(minStr);
    const timerSeconds = parseInt(secsStr);

    if(timerHours > 0 || timerMinutes > 0 || timerSeconds >= 10){
        
        timerSideButtons[0].classList.remove('disabled');
        timerSideButtons[0].removeAttribute('aria-disabled');
        timerSideButtons[0].addEventListener('click', function(){resetTime(timeArray);});
        timerSideButtons[1].classList.remove('disabled');
        timerSideButtons[1].removeAttribute('aria-disabled');
        timerSideButtons[1].addEventListener('click', countDown);
        timerSideButtons[2].classList.remove('disabled');
        timerSideButtons[2].removeAttribute('aria-disabled');
        timerSideButtons[2].addEventListener('click', addPresetTimer);

    } else {

        timerSideButtons.forEach(button => {
            button.classList.add('disabled');
            button.setAttribute('aria-disabled', 'true');
            button.removeEventListener('click',countDown);
            button.removeEventListener('click',resetTime);
            button.removeEventListener('click',addPresetTimer);
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

    let seconds  = parseInt(intify(secs.innerText));
    let minutes = parseInt(intify(mins.innerText));
    let hours = parseInt(intify(hrs.innerText));

    // count down for seconds when greater than zero
    if(seconds > min){
        seconds -=1;
        secs.innerText =seconds < 10?'0'+seconds:display11(seconds);
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
            alarm();
            showNotification(
                '<i class="fa-solid fa-bell"></i>',
                'Timer done :)',
                'moodDanger'
            )
        }
        // update DOM element.
        hrs.innerText = hours < 10?'0'+hours:display11(hours);

        mins.innerText = minutes < 10 ? '0'+minutes:display11(minutes);

        secs.innerText =seconds < 10?'0'+seconds:display11(seconds);

    }
}


function resetTime(timeArr){
    timeArr.forEach((timeElement)=>{
        timeElement.innerText = '00';
    });
    enableTimerPlaySideButtons();
}


let presetTimes = [];

function addPresetTimer(){
    const customTimerEmpty = document.querySelector('.customTimersWrappers>.empty');
    let presetTime = '';
    if(presetTimes.length<=5 & customTimerEmpty !== null){
        const h = document.querySelector('.timerHours .value .digits');
        const m = document.querySelector('.timerMinutes .value .digits');
        const s = document.querySelector('.timerSeconds .value .digits');
        
        presetTime = `${h.innerText}:${m.innerText}:${s.innerText}`;
        if(!presetTimes.includes(presetTime,0)){

            presetTimes.push(presetTime);

            const span = document.createElement('span');
            span.innerText = presetTime;
            customTimerEmpty.appendChild(span);
            customTimerEmpty.classList.remove('empty');
            showNotification('<i class="fa-solid fa-circle-plus"></i>','Added Preset: You Added a timer preset.','moodSuccess');

        } else {
           showNotification(
            '<i class="fa-solid fa-circle-info"></i>',
            'Duplicate : This timer preset already exists.',
            'moodWarning'
           );
        }
    } else {
        showNotification(
            '<i class="fa-solid fa-circle-info"></i>',
            'Timer Presets full, long press timer pills to delete.',
            'moodWarning'
           );
    }
}

function showNotification(icon,message,mood){
    const popup = document.querySelector('.interactivePops');
    popup.querySelector('.icon').innerHTML = icon;
    popup.querySelector('.content').innerHTML = message;
    if(mood){
        popup.classList.remove('default');
        popup.classList.add(mood);
    }
    popup.classList.remove('hide');

    setTimeout(()=>{hideNotification(mood)},3000);
}

function hideNotification(mood){
    const popup = document.querySelector('.interactivePops');
    popup.querySelector('.icon').innerHTML = '<i class="fa-solid fa-bell"></i>';
    popup.querySelector('.content').innerHTML = 'Message: Hello world !';
    popup.classList.remove(mood);
    popup.classList.add('hide');
}


function dblClickPreset(presetDiv,index){
    
    presetDiv.querySelector('.delete').addEventListener('click',(e)=>{
        deletePreset(index);
        presetDiv.querySelector('.delete').style.display = 'none';
    });
    if(!presetDiv.classList.contains('empty')){
        
        if(presetDiv.querySelector('.delete').style.display === 'flex'){
            presetDiv.querySelector('.delete').style.display = 'none';
        } else {
            presetDiv.querySelector('.delete').style.display = 'flex';
        }
    }
}

function deletePreset(index){
    presetTimes.splice(index,1);
    reorderPresetsDiv();
    showNotification('<i class="fa-solid fa-trash"></i>','Deleted Preset: You deleted a timer preset.','moodDanger');

}

function reorderPresetsDiv(){
    clearPresets();
    fillPresets();
}

function clearPresets(){
    document.querySelectorAll('.customTimersWrappers .customTimer').forEach((preset)=>{
        if(preset.querySelector('span') !== null){
            preset.querySelector('span').remove();
            preset.classList.add('empty');
        }
    });
}

function fillPresets(){

    for(let index = 0; index < presetTimes.length; index++){
        const child = document.createElement('span');
        child.innerText = presetTimes[index];
        document.querySelectorAll('.customTimersWrappers .customTimer')[index].classList.remove('empty');
        document.querySelectorAll('.customTimersWrappers .customTimer')[index].appendChild(child);
    }
}

function loadPreset(presetDiv){
    const h = document.querySelector('.timerHours .value .digits');
    const m = document.querySelector('.timerMinutes .value .digits');
    const s = document.querySelector('.timerSeconds .value .digits');

    if(!presetDiv.classList.contains('empty')){
        let time = presetDiv.innerText.split(':');
        h.innerText = time[0];
        m.innerText = time[1];
        s.innerText = time[2];
        enableTimerPlaySideButtons(); 
    }

}

function alarm(){
    startpulsingNotification();
}

function startpulsingNotification(){
    const pulserWrap = document.querySelector('.cardContentWrapper');
    pulserWrap.classList.add('cardContentWrapperNotification');

    setTimeout(stopPulsingNotification,5000);
}

function stopPulsingNotification(){
    const pulserWrap = document.querySelector('.cardContentWrapper');
    pulserWrap.classList.remove('cardContentWrapperNotification');

}

document.addEventListener(
    'DOMContentLoaded',
    ()=>{
        document.querySelectorAll('.customTimersWrappers .customTimer').forEach(
            (child,index)=>{
                child.addEventListener('dblclick',(e)=>{
                    dblClickPreset(child,index);
                });
                child.addEventListener('click',()=>{
                    loadPreset(child);
                })
            }
        );
    }
);

