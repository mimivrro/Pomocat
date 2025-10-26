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


// ...existing code...

(function () {
  const toggle = document.getElementById('settingsToggle');
  const sidebar = document.getElementById('settingsSidebar');
  const overlay = document.getElementById('settingsOverlay');
  const closeBtn = document.getElementById('settingsClose');
  const presets = Array.from(document.querySelectorAll('.preset'));
  const presetNameEl = document.getElementById('presetName');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    if (overlay) { overlay.hidden = false; overlay.style.opacity = '1'; }
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.hidden = true, 220);
    }
  }

  toggle?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  function applyPreset(workMin, breakMin, markActiveId, name) {
    localStorage.setItem('pomodoro-work', String(workMin));
    localStorage.setItem('pomodoro-short', String(breakMin));
    localStorage.setItem('pomodoro-name', name || '');

    clearInterval(timer);
    isRunning = false;
    isBreak = false;
    timeLeft = workMin * 60;
    updateDisplay();

    if (typeof statusText !== 'undefined' && statusText) {
      statusText.textContent = `Preset: ${workMin} / ${breakMin}`;
    }
    if (presetNameEl) presetNameEl.textContent = name || '';

    presets.forEach(p => p.classList.remove('active'));
    const el = document.getElementById(markActiveId);
    if (el) el.classList.add('active');

    window.dispatchEvent(new CustomEvent('pomodoro:durations-changed', {
      detail: { work: Number(workMin), shortBreak: Number(breakMin) }
    }));

    closeSidebar();
  }

  presets.forEach(p => {
    p.addEventListener('click', () => {
      const name = p.dataset.name || p.textContent.trim();
      applyPreset(Number(p.dataset.work), Number(p.dataset.break), p.id, name);
    });
  });

  (function init() {
    const storedWork = Number(localStorage.getItem('pomodoro-work') || 25);
    const storedShort = Number(localStorage.getItem('pomodoro-short') || 5);
    const storedName = localStorage.getItem('pomodoro-name') || 'Quick study sesh';

    timeLeft = storedWork * 60;
    updateDisplay();

    if (typeof statusText !== 'undefined' && statusText) {
      statusText.textContent = `Preset: ${storedWork} / ${storedShort}`;
    }
    if (presetNameEl) presetNameEl.textContent = storedName;

    const match = presets.find(p => Number(p.dataset.work) === storedWork && Number(p.dataset.break) === storedShort);
    if (match) match.classList.add('active');
  })();
})();






const taskInput = document.getElementById('taskInput');

const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const left = document.createElement('div');
    left.classList.add('task-left');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;

    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.textContent = task.text;

    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    left.appendChild(checkbox);
    left.appendChild(textSpan);

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.classList.add('delete-btn');
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    li.appendChild(left);
    li.appendChild(delBtn);

    if (task.completed) li.classList.add('completed');
    taskList.appendChild(li);
  });
}


// Add new task on pressing Enter
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      tasks.push({ text: taskText, completed: false });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      taskInput.value = '';
      renderTasks();
    }
  }
});


window.addEventListener('load', renderTasks);
