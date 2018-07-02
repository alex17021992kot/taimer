// Timer

const buttons = document.querySelectorAll('[data-time]');
const form = document.forms['customForm'];
const userMinutes = form.querySelector('input');
const stopButton = document.querySelector('.stop-button');

const timer = (function() {

    let countdown,
        timerDisplay,
        endTime,
        alarmSound;

    function init(settings) {
        timerDisplay = document.querySelector(settings.timeLeftSelector);
        endTime = document.querySelector(settings.timeEndSelector);

        if (settings.alarmSound) {
            alarmSound = new Audio(settings.alarmSound);
        }

        return this;
    }
    function start(seconds) {

        if (!timerDisplay || !endTime) return console.log('Please init module first');
        if(!seconds || typeof seconds !== 'number' || seconds < 0) return console.log('Please provide seconds');

        clearInterval(countdown);
        alarmSound.pause();
        alarmSound.currentTime = 0;

        const now = Date.now();
        const then = now + seconds * 1000;

        displayTimeLeft(seconds);
        displayEndTime(then);

        countdown = setInterval(()=>{
            const secondsLeft = Math.round((then - Date.now()) / 1000);

            if (secondsLeft < 0) {
                clearInterval(countdown);
                playSound();
                return;
            }

            displayTimeLeft(secondsLeft);
        }, 1000);

    }
    function displayTimeLeft(seconds) {

        const minutes = Math.floor(seconds / 60);
        const reminderSeconds = seconds % 60;

        if (minutes < 60) {

            display = displayNumber(minutes) + ':' +
                      displayNumber(reminderSeconds);

        } else if (minutes >= 60 && minutes < 1440) {

            const hours = Math.floor(minutes / 60);
            const reminderMinutes = minutes % 60;

            display = displayNumber(hours) + ':' +
                      displayNumber(reminderMinutes) + ':' +
                      displayNumber(reminderSeconds);

        } else {

            const days = Math.floor(minutes / 1440);
            const restMinutes = minutes % 1440;
            const hours = Math.floor(restMinutes / 60);
            const reminderMinutes = restMinutes % 60;

            display = `${days} days ` +
                      displayNumber(hours) + ':' +
                      displayNumber(reminderMinutes) + ':' +
                      displayNumber(reminderSeconds);

        }

        document.title = display;
        timerDisplay.textContent = display;
    }
    function displayNumber(number) {
        return `${number < 10 ? '0' : ''}${number}`;
    }
    function displayEndTime(timestamp) {

        const end = new Date(timestamp);
        const hour = end.getHours();
        const minutes = end.getMinutes();

        endTime.textContent = `Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;

    }
    function stop() {
        clearInterval(countdown);
    }
    function playSound() {
        alarmSound.play();
    }

    return{
        init,
        start,
        stop
    }

}());

// init timer
timer.init({
    timeLeftSelector: '.display__time-left',
    timeEndSelector: '.display__end-time',
    alarmSound: 'audio/bell.mp3'
}).start(10000);

// start timer by click
function startTimer(e) {
    const seconds = parseInt(this.dataset.time);
    timer.start(seconds);
}

function runCustomMinutes(e) {
    e.preventDefault();

    let userSeconds = parseInt(userMinutes.value) * 60;
    timer.start(userSeconds);
}

buttons.forEach(btn => btn.addEventListener('click', startTimer));

form.addEventListener('submit', runCustomMinutes);

stopButton.addEventListener('click', timer.stop);