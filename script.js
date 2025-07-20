const playBtn = document.getElementsByClassName("playbtn")[0];
const lapBtn = document.getElementsByClassName("lapbtn")[0];
const resetBtn = document.getElementsByClassName("resetbtn")[0];
const lapS = document.getElementsByClassName("laps")[0];
const clearBtn = document.getElementsByClassName("clearbtn")[0];
const themeToggle = document.getElementById("themeToggle");

const sec = document.getElementsByClassName("sec")[0];
const msec = document.getElementsByClassName("msec")[0];
const min = document.getElementsByClassName("min")[0];

let secCounter = 0, msecCounter = 0, minCounter = 0;
let secs, msecs, mins;
let lapItem = 0;

// Format helper
const format = (val) => (val < 10 ? `0${val}` : val);

const toggleBtn = () => {
  lapBtn.classList.add("visibility");
  resetBtn.classList.add("visibility");
};

const play = () => {
  toggleBtn();
  if (playBtn.innerHTML === "Start") {
    playBtn.innerHTML = "Pause";

    mins = setInterval(() => {
      min.innerHTML = `${format(++minCounter)} :`;
    }, 60000);

    secs = setInterval(() => {
      if (secCounter === 59) secCounter = 0;
      else secCounter++;
      sec.innerHTML = ` ${format(secCounter)} :`;
    }, 1000);

    msecs = setInterval(() => {
      if (msecCounter === 99) msecCounter = 0;
      else msecCounter++;
      msec.innerHTML = ` ${format(msecCounter)}`;
    }, 10);
  } else {
    playBtn.innerHTML = "Start";
    clearInterval(mins);
    clearInterval(secs);
    clearInterval(msecs);
  }

  if (playBtn.innerHTML === "Pause") {
    lapBtn.classList.remove("visibility");
    resetBtn.classList.remove("visibility");
  }
};

const reset = () => {
  clearInterval(mins);
  clearInterval(secs);
  clearInterval(msecs);

  minCounter = 0;
  secCounter = 0;
  msecCounter = 0;

  min.innerHTML = "00 :";
  sec.innerHTML = " 00 :";
  msec.innerHTML = " 00";

  playBtn.innerHTML = "Start";
  lapBtn.classList.add("visibility");
  resetBtn.classList.add("visibility");
};

const lap = () => {
  const li = document.createElement("li");
  li.setAttribute("class", "lap-item");

  const number = document.createElement("span");
  number.setAttribute("class", "number");
  number.innerText = `Lap ${++lapItem}`;

  const timeStamp = document.createElement("span");
  timeStamp.setAttribute("class", "time-stamp");
  const lapTime = `${format(minCounter)} :${format(secCounter)} :${format(msecCounter)}`;
  timeStamp.innerText = lapTime;

  li.append(number, timeStamp);
  lapS.appendChild(li);
  clearBtn.classList.remove("laptime");

  // 🔊 Sound effect
  const beep = new Audio("https://pixabay.com/sound-effects/mechanical-stopwatch-ticking-30-seconds-364932/");
  beep.play();

  // 📳 Vibration
  if ("vibrate" in navigator) {
    navigator.vibrate([100, 50, 100]);
  }

  // 💾 Save to localStorage
  saveLapToStorage(lapTime);
};

const clear = () => {
  lapS.innerHTML = "";
  lapItem = 0;
  clearBtn.classList.add("laptime");
  clearLapStorage();
};

function saveLapToStorage(time) {
  const laps = JSON.parse(localStorage.getItem("lapHistory")) || [];
  laps.push(time);
  localStorage.setItem("lapHistory", JSON.stringify(laps));
}

function loadLapHistory() {
  const laps = JSON.parse(localStorage.getItem("lapHistory")) || [];
  laps.forEach((time, i) => {
    const li = document.createElement("li");
    li.className = "lap-item";

    const number = document.createElement("span");
    number.className = "number";
    number.textContent = `#${i + 1}`;

    const timeStamp = document.createElement("span");
    timeStamp.className = "time-stamp";
    timeStamp.textContent = time;

    li.append(number, timeStamp);
    lapS.appendChild(li);
  });

  if (laps.length > 0) clearBtn.classList.remove("laptime");
  lapItem = laps.length;
}

function clearLapStorage() {
  localStorage.removeItem("lapHistory");
}

// 🌗 Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = document.body.classList.contains("dark") ? "☀️" : "🌙";
  themeToggle.textContent = icon;
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load theme + lap history on page load
window.onload = () => {
  loadLapHistory();
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
};

playBtn.addEventListener("click", play);
lapBtn.addEventListener("click", lap);
resetBtn.addEventListener("click", reset);
clearBtn.addEventListener("click", clear);
