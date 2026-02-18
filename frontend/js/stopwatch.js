//stopwatch functionality to render stopwatch and update localStorage
// when user resets timer, switches to another technique, or finishes the session

// --------------- CONSTANTS -------------------------------------

// -------------- DOM REFERENCES ---------------------------------

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

const logBtns = document.querySelectorAll(".log-progress");

// ------------- GLOBAL VARIABLES ---------------------------------
let minute = 0;
let second = 0;
let timer; //timer object to start/stop stopwatch
let storageKey; //key to store timer information in localStorage;

// ------------ FUNCTIONS ----------------------------------------
function stopWatch() {
  second++;
  if (second == 60) {
    minute++;
    second = 0;
  }
  if (minute == 60) {
    second = 0;
  }
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("min").textContent = minute
    .toString()
    .padStart(2, "0");
  document.getElementById("sec").textContent = second
    .toString()
    .padStart(2, "0");
}

function logExerciseTime(key) {
  let storage = window.localStorage;
  const stopwatch = 60*minute + second;
  storage.setItem(key, stopwatch);
  console.log("localStorage key:",key, "value: ", storage.getItem(key));

  console.log("tempTime", storage.getItem("tempTime"));
  console.log("exerciseTime", storage.getItem("exerciseTime"));
  console.log("breathingTime", storage.getItem("breathingTime"));
  console.log("relaxationTime", storage.getItem("relaxationTime"));
  console.log("logId", storage.getItem("logId"));

}

// ------------ EVENT LISTENERS ----------------------------------
startBtn.addEventListener("click", function () {
  // Check if timer is not already running
  if (!timer) {
    timer = setInterval(stopWatch, 1000); //wait 1 second
  }
});

stopBtn.addEventListener("click", function () {
  clearInterval(timer);
  timer = null; // Reset timer variable
});

resetBtn.addEventListener("click", function () {
  clearInterval(timer);
  timer = null; // Reset timer variable
  minute = 0;
  second = 0;
  updateDisplay();
});

logBtns.forEach(element => {
  storageKey = element.getAttribute("data-storagekey");
  element.addEventListener('click', () => {logExerciseTime(storageKey)});
})