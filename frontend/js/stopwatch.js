//stopwatch functionality to render stopwatch and update localStorage
// when user resets timer, switches to another technique, or finishes the session

//basecode example provided from
//"https://www.geeksforgeeks.org/javascript/create-a-stopwatch-using-bootstrap-javascript/"

// --------------- CONSTANTS -------------------------------------







// -------------- DOM REFERENCES ---------------------------------

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");


// ------------- GLOBAL VARIABLES ---------------------------------
let minute = 0;
let second = 0;
let timer;


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


