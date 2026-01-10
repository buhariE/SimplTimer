// Retrieve elements from DOM
const themeToggleWrapper = document.querySelector('.themeToggleWrapper');
const themeToggleCircle = document.querySelector('.themeToggleCircle');
const hourToggleCircle = document.querySelector('.hourToggleCircle');

const contentCardsContainer = document.querySelector('.contentCards');

const timezoneDropDopdownBtn = document.querySelector('.timeZoneDropDown');
const timezoneDropDopdownContent = document.querySelector('.timezoneBackDrop');
const timezoneDropDopdownClose = document.querySelector('.closeBtn');
const menuItems = document.querySelectorAll('.menuItem');

const dialog = document.getElementById('notificationDialog');
const audio = new Audio('./resources/audio/alarm.mp3');

const timerSideButtons = document.querySelectorAll('.timerSideButtons div');

const searchInput = document.getElementById('tzSearch');


// init global variables
let theme = 'dark';
let hourFormat = '12H';
let timeZoneFormat = Intl.DateTimeFormat().resolvedOptions().timeZone;
const translateXvalue = 345;
let contentCardMovement = 0;
let max = 0;
let min = -(2*translateXvalue);

// plaecholder time zone values
const timeZones = {
    "Africa/Accra": "Ghana Standard Time",
    "Africa/Cairo":"Egypt Standard Time",
    "Africa/Johannesburg":"South-Africa Standard Time",
    "Africa/Lagos":"Nigeria Standard Time",
    "Asia/Dubai": "Gulf Standard Time",
    "Asia/Kolkata": "India Standard Time",
    "Asia/Dhaka": "Bangladesh Time",
    "Asia/Colombo": "Sri Lanka Time",
    "Asia/Bangkok": "Indochina Time",
    "Asia/Shanghai": "China Standard Time",
    "Asia/Tokyo": "Japan Standard Time",
    "Asia/Seoul": "Korea Standard Time",
    "Asia/Singapore": "Singapore Time",
    "Australia/Sydney": "Australian Eastern Time",
    "Australia/Adelaide": "Australian Central Time",
    "Australia/Perth": "Australian Western Time",
    "Pacific/Auckland": "New Zealand Time",
    "Pacific/Fiji": "Fiji Time",
    "Pacific/Tongatapu": "Tonga Time",
    "America/Edmonton": "Mountain Time (Calgary, Edmonton)",
    "America/New_York": "Eastern Time (US & Canada)",
    "America/Chicago": "Central Time (US & Canada)",
    "America/Denver": "Mountain Time (US & Canada)",
    "America/Phoenix": "Arizona (No DST)",
    "America/Los_Angeles": "Pacific Time (US & Canada)",
    "America/Anchorage": "Alaska",
    "Pacific/Honolulu": "Hawaii",
    "America/Toronto": "Eastern Time (Canada)",
    "America/Mexico_City": "Central Time (Mexico)",
    "America/Caracas": "Venezuela Time",
    "America/Santiago": "Santiago, Chile",
    "America/Lima": "Lima, Peru",
    "America/Bogota": "Bogota, Colombia",
    "America/Argentina/Buenos_Aires": "Buenos Aires, Argentina",
    "Europe/London": "Greenwich Mean Time (UK)",
    "Europe/Paris": "Central European Time",
    "Europe/Berlin": "CET (Germany)",
    "Europe/Rome": "CET (Italy)",
    "Europe/Madrid": "CET (Spain)",
    "Europe/Amsterdam": "CET (Netherlands)",
    "Europe/Stockholm": "CET (Sweden)",
    "Europe/Istanbul": "Turkey Time",
    "Europe/Moscow": "Moscow Time",
};

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
    displayItems(Object.values(timeZones));
}

function intify(string){
    return string.replaceAll(' ', '') === null?string:string.replaceAll(' ', '');
}

function reformat11(text){
    return text === '1 1'?11:text;
}

function display11(text){
    return text == 11?'1 1':text;
}

function displayTime(){

    const presentDateFormatter = Intl.DateTimeFormat(
        'en-US',
        {
            timeZone: timeZoneFormat,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }
    );

    const now = new Date();
    let timeFormattedArr = presentDateFormatter.format(now).split(':');

    let hours = intify(timeFormattedArr[0]);
    let minutes = intify(timeFormattedArr[1]);
    let seconds = intify(timeFormattedArr[2]);
    let ampm = '';
    if(hourFormat === '12H'){
        ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? `0${hours}`:hours;
    } else {
        ampm = 'HRS';
    }


    const hoursDiv = document.querySelector('.timeHours');
    hoursDiv.innerText = display11(hours);
    const minutesDiv = document.querySelector('.timeMinutes');
    minutesDiv.innerText = display11(minutes);
    const secondsDiv = document.querySelector('.timeSeconds');
    secondsDiv.innerText = display11(seconds);
    const ampmDiv = document.querySelector('.timePeriod');
    ampmDiv.innerText = ampm;

    setTimeout(displayTime, 1000);
}

displayTime();

function validateTimerInput(maxvalue,minvalue,value){
    if(value>=maxvalue){
        return minvalue;
    } else if(value<minvalue) {
        return maxvalue-1;
    }
    return value;
}

function displayDD(num){
    if(num < 10){
        return `0${num}`;
    } else if(num == 11){
        return '1 1';
    } return num;
}
function displayDW(word){
    if(word == '11'){
        return '1 1';
    } else if(word === '60'){
        return '59';
    } return word;
}

function incrementTime(max,min,parentClass,successorClass){
    const textfield = document.querySelector(`.${parentClass} .value input[type="text"]`);
    const successor = document.querySelector(`.${successorClass} .value input[type="text"]`);

    let reValue = reformat11(textfield.value);
    textfield.value = displayDD(validateTimerInput(max,min,++reValue));
    if(successor){
        let temp = parseInt(reformat11(successor.value));
        successor.value = '';
        successor.value = reValue >= max?displayDD(temp+1):displayDD(temp);
        successor.value = successor.value === `${max}`?'00':successor.value;
        console.log(successor.value);
    }
    enableTimerPlaySideButtons();
}
function decrementTime(max,min,parentClass,successorClass){
    const textfield = document.querySelector(`.${parentClass} .value input[type="text"]`);
	const successor = document.querySelector(`.${successorClass} .value input[type="text"]`);

    let reValue = reformat11(textfield.value);
    textfield.value = displayDD(validateTimerInput(max,min,--reValue));
    if(successor){
        let temp = parseInt(reformat11(successor.value));
        successor.value = '';
        successor.value = reValue <= min?displayDD(temp-1):displayDD(temp);
        successor.value = successor.value === '0-1'?'00':successor.value;
        console.log(successor.value);
    }
    enableTimerPlaySideButtons();
}

function enableTimerPlaySideButtons(){

    let hrsStr= intify(document.querySelector('.timerHours .value .digits').value);
    let minStr = intify(document.querySelector('.timerMinutes .value .digits').value);
    let secsStr = intify(document.querySelector('.timerSeconds .value .digits').value);

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

    let seconds  = parseInt(intify(secs.value));
    let minutes = parseInt(intify(mins.value));
    let hours = parseInt(intify(hrs.value));

    // count down for seconds when greater than zero
    if(seconds > min){
        seconds -=1;
        secs.value =seconds < 10?'0'+seconds:display11(seconds);
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
        }
        // update DOM element.
        hrs.value = hours < 10?'0'+hours:display11(hours);

        mins.value = minutes < 10 ? '0'+minutes:display11(minutes);

        secs.value =seconds < 10?'0'+seconds:display11(seconds);

    }
}


function resetTime(timeArr){
    timeArr.forEach((timeElement)=>{
        timeElement.value = '00';
    });
    if(intervalIdCtDwn){
        clearInterval(intervalIdCtDwn);
        timerSideButtons[1].classList.remove('stop');
        timerSideButtons[1].innerHTML = '<i class="fa-solid fa-play"></i>';
    }
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

        presetTime = `${h.value}:${m.value}:${s.value}`;
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
        h.value = time[0];
        m.value = time[1];
        s.value = time[2];
        enableTimerPlaySideButtons();
    }

}

function alarm(){
    startpulsingNotification();
    playAudio();
    showDialog('Timer Completed!');
}

function startpulsingNotification(){
    const pulserWrap = document.querySelector('.cardContentWrapper');
    pulserWrap.classList.add('cardContentWrapperNotification');
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
                child.addEventListener('dblclick',()=>{
                    dblClickPreset(child,index);
                });
                child.addEventListener('click',()=>{
                    loadPreset(child);
                })
            }
        );
        // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.querySelector('.timezoneValue').innerText = timeZoneFormat;

        document.querySelectorAll('.digits').forEach((input)=>{
            input.addEventListener('input', function () {
                this.value = this.value.replace(/[^0-9]/g, '');
                this.value = displayDW(this.value);
                enableTimerPlaySideButtons();
            });

            input.addEventListener('blur', function () {
                this.value = this.value.length < 2?`0${this.value}`:this.value;
            });
        });


    }
);

const example = ["value","check","word","manifold","manifest","manieuse"]

function search(){
    let value = searchInput.value.toLowerCase();
    searchArray(value,Object.values(timeZones));
}

function searchArray(value,object){
    let result = [];
    result = object.filter((word)=>(value.length >= 1 & word.toLowerCase().includes(value)));
    // console.log(result);
    showResults(value,result);

}

function showResults(value,result){
    if(value === ''){
        displayItems(Object.values(timeZones));
    } else if(result.length === 0) {
        displayEmptyItem(value);
    } else {
        displayHitItems(result,value);
    }
}

function displayItems(items){
    clearList();
    const label = document.querySelector('.timezoneValue');
    const wrappers = document.querySelector('.tzDDCList');
    for(let item of items){
        const listDiv = document.createElement('div');
        listDiv.classList.add('tzDDCListItem');
        // listDiv.classList.add('defaultItem');
        let newValue = Object.keys(timeZones).find(key => timeZones[key] === item);
        listDiv.addEventListener('click', () =>{
            itemEvent(newValue)
            listDiv.classList.add('selectedTimeZone');
        });
        if(label.innerText === newValue){
            listDiv.classList.add('selectedTimeZone');
        } else {
            listDiv.classList.remove('selectedTimeZone');
        }
        listDiv.innerText = item;
        wrappers.appendChild(listDiv);
    }
}

function displayHitItems(items,value) {
    
    clearList();
    const label = document.querySelector('.timezoneValue');
    const wrappers = document.querySelector('.tzDDCList');

    if ('highlights' in CSS) {
        CSS.highlights.delete('search-highlight');
    }

    const ranges = [];
    
    for (let item of items) {
        const listDiv = document.createElement('div');
        listDiv.classList.add('tzDDCListItem');
        listDiv.classList.add('hitItem');
        let newValue = Object.keys(timeZones).find(key => timeZones[key] === item);
        listDiv.addEventListener('click', () => {
            itemEvent(newValue)
            listDiv.classList.add('selectedTimeZone');
        });
        if (label.innerText === newValue) {
            listDiv.classList.add('selectedTimeZone');
            listDiv.classList.remove('hitItem');
        } else {
            listDiv.classList.remove('selectedTimeZone');
        }
        listDiv.innerText = item;
        wrappers.appendChild(listDiv);

        // let start = item.toLocaleLowerCase().indexOf(value,0);
        // let end = start + value.length;

        // console.log(`range: ${start} to ${end}`,);

        // range.setStart(listDiv,start);
        // range.setEnd(listDiv,end);

        // const highlight = new Highlight(range);

        // CSS.highlights.set("user-1-highlight",highlight);
        if (value && item.toLowerCase().includes(value.toLowerCase())) {
            const textNode = listDiv.firstChild;
            const start = item.toLowerCase().indexOf(value.toLowerCase());
            const end = start + value.length;

            const range = new Range();
            range.setStart(textNode, start);
            range.setEnd(textNode, end);
            ranges.push(range);
        }

    }
    if (ranges.length > 0 && 'highlights' in CSS) {
        const highlight = new Highlight(...ranges);
        CSS.highlights.set('search-highlight', highlight);
    }
}

function displayEmptyItem(word){
    clearList();
    const wrappers = document.querySelector('.tzDDCList');
    wrappers.innerHTML = `<div class="tzDDCListItem emptyList">no result found for '${word}'</div>`;
}

function clearList(){
    const wrappers = document.querySelector('.tzDDCList');
    wrappers.innerHTML = ``;
}

function itemEvent(newValue){
    const label = document.querySelector('.timezoneValue');
    label.innerText = newValue;
    closeBackDrop();
    showNotification('<i class="fa-solid fa-globe"></i>',`Time-zone: ${newValue}`,'moodSuccess');
    timeZoneFormat = newValue;
}

// Stopwatch Functions
let intervalIdStopwatch;
let stopwatchRunning = false;

function startStopwatch() {
    const stopwatchHours = document.querySelector('#stopwatchCard .timeHours');
    const stopwatchMinutes = document.querySelector('#stopwatchCard .timeMinutes');
    const stopwatchSeconds = document.querySelector('#stopwatchCard .timeSeconds');

    const playButton = document.querySelector('#stopwatchCard .playButton');
    const resetButton = document.querySelector('#stopwatchCard .resetButton');
    const lapButton = document.querySelector('#stopwatchCard .lapButton');

    if (stopwatchRunning) {
        clearInterval(intervalIdStopwatch);
        stopwatchRunning = false;
        playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        resetButton.classList.remove('disabled');
        resetButton.removeAttribute('aria-disabled');

        // Disable lap button when paused
        lapButton.classList.add('disabled');
        lapButton.setAttribute('aria-disabled', 'true');
    } else {
        stopwatchRunning = true;
        playButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        resetButton.classList.add('disabled');
        resetButton.setAttribute('aria-disabled', 'true');

        // Enable lap button when running
        lapButton.classList.remove('disabled');
        lapButton.removeAttribute('aria-disabled');

        intervalIdStopwatch = setInterval(() => {
            incrementStopwatch(stopwatchSeconds, stopwatchMinutes, stopwatchHours);
        }, 1000);
    }
}

function incrementStopwatch(secondsEl, minutesEl, hoursEl) {
    let seconds = parseInt(intify(secondsEl.innerText));
    let minutes = parseInt(intify(minutesEl.innerText));
    let hours = parseInt(intify(hoursEl.innerText));

    seconds += 1;

    if (seconds >= 60) {
        seconds = 0;
        minutes += 1;
    }

    if (minutes >= 60) {
        minutes = 0;
        hours += 1;
    }

    if (hours >= 100) {
        clearInterval(intervalIdStopwatch);
        stopwatchRunning = false;
        const playButton = document.querySelector('#stopwatchCard .playButton');
        playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        showNotification(
            '<i class="fa-solid fa-stopwatch"></i>',
            'Stopwatch maxed out at 99:59:59',
            'moodWarning'
        );
        return;
    }

    secondsEl.innerText = seconds < 10 ? '0' + seconds : display11(seconds);
    minutesEl.innerText = minutes < 10 ? '0' + minutes : display11(minutes);
    hoursEl.innerText = hours < 10 ? '0' + hours : display11(hours);
}

function resetStopwatch() {
    if (!stopwatchRunning) {
        const stopwatchHours = document.querySelector('#stopwatchCard .timeHours');
        const stopwatchMinutes = document.querySelector('#stopwatchCard .timeMinutes');
        const stopwatchSeconds = document.querySelector('#stopwatchCard .timeSeconds');

        stopwatchHours.innerText = '00';
        stopwatchMinutes.innerText = '00';
        stopwatchSeconds.innerText = '00';

        const resetButton = document.querySelector('#stopwatchCard .resetButton');
        resetButton.classList.add('disabled');
        resetButton.setAttribute('aria-disabled', 'true');

        // Clear all lap times
        clearLaps();
    }
}
// Lap Times Functionality
let lapTimes = [];
let lastLapTime = 0;

function recordLap() {
    if (stopwatchRunning) {
        const stopwatchHours = document.querySelector('#stopwatchCard .timeHours');
        const stopwatchMinutes = document.querySelector('#stopwatchCard .timeMinutes');
        const stopwatchSeconds = document.querySelector('#stopwatchCard .timeSeconds');

        // Get current time values - handle the "1 1" special case
        let hoursText = stopwatchHours.innerText;
        let minutesText = stopwatchMinutes.innerText;
        let secondsText = stopwatchSeconds.innerText;

        // Remove spaces (for the "1 1" display)
        hoursText = hoursText.replace(/\s/g, '');
        minutesText = minutesText.replace(/\s/g, '');
        secondsText = secondsText.replace(/\s/g, '');

        const hours = parseInt(hoursText) || 0;
        const minutes = parseInt(minutesText) || 0;
        const seconds = parseInt(secondsText) || 0;

        // Calculate total seconds
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        // Calculate lap time (difference from last lap)
        const lapSeconds = totalSeconds - lastLapTime;

        console.log('Debug:', {
            hours, minutes, seconds,
            totalSeconds,
            lastLapTime,
            lapSeconds,
            lapNumber: lapTimes.length + 1
        });

        lastLapTime = totalSeconds;

        // Store lap data
        const lapData = {
            number: lapTimes.length + 1,
            totalTime: formatTime(hours, minutes, seconds),
            totalSeconds: totalSeconds,
            lapSeconds: lapSeconds,
            lapTime: formatTimeFromSeconds(lapSeconds)
        };

        lapTimes.push(lapData);

        // Display the lap
        displayLap(lapData);

        // Notification
        showNotification(
            '<i class="fa-solid fa-flag"></i>',
            `Lap ${lapData.number}: ${lapData.lapTime}`,
            'moodSuccess'
        );
    }
}

function formatTimeFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const h = hours < 10 ? '0' + hours : hours.toString();
    const m = minutes < 10 ? '0' + minutes : minutes.toString();
    const s = seconds < 10 ? '0' + seconds : seconds.toString();

    return `${h}:${m}:${s}`;
}

function formatTime(hours, minutes, seconds) {
    const h = hours < 10 ? '0' + hours : hours.toString();
    const m = minutes < 10 ? '0' + minutes : minutes.toString();
    const s = seconds < 10 ? '0' + seconds : seconds.toString();

    return `${h}:${m}:${s}`;
}

function displayLap(lapData) {
    const lapListWrapper = document.querySelector('.lapTimesListWrapper');

    // Remove "no laps" message if it exists (only once)
    const noLapsMsg = lapListWrapper.querySelector('.noLapsMessage');
    if (noLapsMsg) {
        noLapsMsg.remove();
    }

    const lapItem = document.createElement('div');
    lapItem.classList.add('lapTimeItem');
    lapItem.setAttribute('data-lap-number', lapData.number);

    lapItem.innerHTML = `
        <span class="lapNumber">Lap ${lapData.number}</span>
        <span class="lapTime">${lapData.lapTime}</span>
    `;

    // Add to top of list (most recent first)
    lapListWrapper.insertBefore(lapItem, lapListWrapper.firstChild);

    // Update lap count
    updateLapCount();
}

function clearLaps() {
    lapTimes = [];
    lastLapTime = 0;
    const lapListWrapper = document.querySelector('.lapTimesListWrapper');
    lapListWrapper.innerHTML = '<div class="noLapsMessage">No laps recorded yet</div>';
    updateLapCount();
}

function updateLapCount() {
    const count = lapTimes.length;

    // Update both counters
    document.getElementById('lapCountModal').innerText = count;

    const badge = document.getElementById('lapCountBadge');
    if (badge) {
        badge.innerText = count;
    }

    // Show/hide the view laps button
    const viewLapsBtn = document.querySelector('.viewLapsBtn');
    if (viewLapsBtn) {
        if (count > 0) {
            viewLapsBtn.style.display = 'flex';
        } else {
            viewLapsBtn.style.display = 'none';
        }
    }
}

function toggleLapModal(event) {
    const modal = document.getElementById('lapModal');

    // If clicking on the modal background (not the content), close it
    if (event && event.target === modal) {
        modal.classList.remove('show');
    } else {
        modal.classList.toggle('show');
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in search input
    if (e.target.tagName === 'INPUT') {
        return;
    }

    const key = e.key.toLowerCase();

    // Get current active card index
    let currentCardIndex = 0;
    menuItems.forEach((item, idx) => {
        if (item.classList.contains('activeMenu')) {
            currentCardIndex = idx;
        }
    });

    switch(key) {
        case ' ': // Spacebar
            e.preventDefault(); // Prevent page scroll
            handleSpaceKey(currentCardIndex);
            break;

        case 'r':
            e.preventDefault();
            handleResetKey(currentCardIndex);
            break;

        case 'l':
            e.preventDefault();
            if (currentCardIndex === 2) { // Stopwatch
                recordLap();
            }
            break;

        case 'v':
            e.preventDefault();
            if (currentCardIndex === 2) { // Stopwatch
                toggleLapModal();
            }
            break;

        case '1':
            e.preventDefault();
            moveCards(0); // World Clock
            break;

        case '2':
            e.preventDefault();
            moveCards(1); // Timer
            break;

        case '3':
            e.preventDefault();
            moveCards(2); // Stopwatch
            break;

        case 't':
            e.preventDefault();
            toggleTheme();
            break;

        case 'h':
            e.preventDefault();
            toggleFormat();
            break;

        case 'escape':
            e.preventDefault();
            handleEscapeKey();
            break;

        case 'arrowup':
            e.preventDefault();
            if (currentCardIndex === 1) { // Timer
                handleArrowKey('up');
            }
            break;

        case 'arrowdown':
            e.preventDefault();
            if (currentCardIndex === 1) { // Timer
                handleArrowKey('down');
            }
            break;
    }
});

// Handle spacebar for play/pause
function handleSpaceKey(cardIndex) {
    if (cardIndex === 1) { // Timer
        const playButton = document.querySelector('#timerCard .playButton');
        if (!playButton.classList.contains('disabled')) {
            countDown();
        }
    } else if (cardIndex === 2) { // Stopwatch
        startStopwatch();
    }
}

// Handle reset key
function handleResetKey(cardIndex) {
    if (cardIndex === 1) { // Timer
        const resetButton = document.querySelector('#timerCard .resetButton');
        if (!resetButton.classList.contains('disabled')) {
            const timeArray = [
                document.querySelector('.timerHours .value .digits'),
                document.querySelector('.timerMinutes .value .digits'),
                document.querySelector('.timerSeconds .value .digits')
            ];
            resetTime(timeArray);
        }
    } else if (cardIndex === 2) { // Stopwatch
        const resetButton = document.querySelector('#stopwatchCard .resetButton');
        if (!resetButton.classList.contains('disabled')) {
            resetStopwatch();
        }
    }
}

// Handle escape key to close modals/dropdowns
function handleEscapeKey() {
    // Close timezone dropdown
    const timezoneDropdown = document.querySelector('.timezoneBackDrop');
    if (timezoneDropdown.style.display === 'flex') {
        closeBackDrop();
    }

    // Close lap modal
    const lapModal = document.getElementById('lapModal');
    if (lapModal && lapModal.classList.contains('show')) {
        toggleLapModal();
    }
}

// Handle arrow keys for timer adjustment
let timerFocusIndex = 0; // 0=hours, 1=minutes, 2=seconds

function handleArrowKey(direction) {
    const timeElements = [
        document.querySelector('.timerHours .value .digits'),
        document.querySelector('.timerMinutes .value .digits'),
        document.querySelector('.timerSeconds .value .digits')
    ];

    // Visual indicator of which timer unit is "focused"
    highlightTimerUnit(timerFocusIndex);

    if (direction === 'up') {
        if (timerFocusIndex === 0) incrementTime(24,0,'timerHours');
        else if (timerFocusIndex === 1) incrementTime(60,0,'timerMinutes','timerHours');
        else incrementTime(60,0,'timerSeconds','timerMinutes');
    } else {
        if (timerFocusIndex === 0) decrementTime(24,0,'timerHours');
        else if (timerFocusIndex === 1) decrementTime(60,0,'timerMinutes','timerHours');
        else decrementTime(60,0,'timerSeconds','timerMinutes');
    }
}

function highlightTimerUnit(index) {
    const elements = [
        document.querySelector('.timerHours'),
        document.querySelector('.timerMinutes'),
        document.querySelector('.timerSeconds')
    ];

    elements.forEach((el, idx) => {
        if (idx === index) {
            el.style.opacity = '1';
            el.style.transform = 'scale(1.05)';
        } else {
            el.style.opacity = '0.6';
            el.style.transform = 'scale(1)';
        }
    });

    // Reset after a short delay
    setTimeout(() => {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        });
    }, 200);
}

// Cycle through timer units with Tab key
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    if (e.key === 'Tab') {
        e.preventDefault();

        // Get current active card
        let currentCardIndex = 0;
        menuItems.forEach((item, idx) => {
            if (item.classList.contains('activeMenu')) {
                currentCardIndex = idx;
            }
        });

        if (currentCardIndex === 1) { // Timer
            timerFocusIndex = (timerFocusIndex + 1) % 3; // Cycle 0->1->2->0
            highlightTimerUnit(timerFocusIndex);

            showNotification(
                '<i class="fa-solid fa-keyboard"></i>',
                `Timer focus: ${['Hours', 'Minutes', 'Seconds'][timerFocusIndex]}`,
                'default'
            );
        }
    }
});

function showKeyboardHelp() {
    toggleHelpModal();
}

function toggleHelpModal(event) {
    const modal = document.getElementById('helpModal');

    if (event && event.target === modal) {
        modal.classList.remove('show');
    } else {
        modal.classList.toggle('show');
    }
}

function showDialog(message=''){
     dialog.showModal();
     dialog.querySelector('.dialogMessage .messageText').innerText = message;
     playAudio();
}

function closeDialog(){
     dialog.close();
     stopAudio();
     stopPulsingNotification();
}

async function playAudio(){
    audio.loop = true;
    try {
        await audio.play();
    } catch (err) {
        console.error('Failed to play audio:', err);
    }
}

function stopAudio(){
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
}
