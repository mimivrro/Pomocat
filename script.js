let timer;
let isRunning = false;
let isBreak = false;
let timeLeft = 25 * 60; // 25 minutes

const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const catImage = document.getElementById("catImage");

// Audio files
const meowAudio = new Audio("assets/meow.mp3");
const lofiAudio = new Audio("assets/lofi.mp3");
const purrAudio = new Audio("assets/purr.mp3");
const dingAudio = new Audio("assets/ding.mp3");

lofiAudio.loop = true;
purrAudio.loop = true;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function handleAudioAndImage() {
  if (isBreak) {
    // BREAK TIME
    lofiAudio.pause();
    lofiAudio.currentTime = 0;

    purrAudio.play();

    catImage.src = "assets/break_cat.jpg";
    statusText.textContent = "Break Time! ☕";

    dingAudio.play();
  } else {
    // FOCUS TIME
    purrAudio.pause();
    purrAudio.currentTime = 0;

    lofiAudio.play();

    catImage.src = "assets/work_cat.jpg";
    statusText.textContent = "Focus Time 🧠";
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    handleAudioAndImage();

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        isBreak = !isBreak;
        timeLeft = isBreak ? 5 * 60 : 25 * 60;

        handleAudioAndImage();
        updateDisplay();

        startTimer(); // auto start next session
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  catImage.src = "assets/rest_cat.jpg";

  lofiAudio.pause();
  purrAudio.pause();
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isBreak = false;
  timeLeft = 25 * 60;
  updateDisplay();
  statusText.textContent = "Focus Time 🧠";
  catImage.src = "assets/cat.jpg";

  lofiAudio.pause();
  lofiAudio.currentTime = 0;

  purrAudio.pause();
  purrAudio.currentTime = 0;
}

// Meow sound for button clicks
[startBtn, pauseBtn, resetBtn].forEach(btn => {
  btn.addEventListener("click", () => {
    meowAudio.currentTime = 0;
    meowAudio.play();
  });
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay(); // initialize
