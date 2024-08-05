let counter = 0;

let allowedChars = "0123456789";

let piTextRef = document.getElementById("text");
let counterText = document.getElementById("scoreCount");
let learningTextRef = document.getElementById("learningText");
let learningChar = document.getElementById("learningChar");

let fullPI, fullPIcopy;

let timeOfFirstChar;
let timeOfLastChar;

let paused = false;
let learningMode = false;

async function loadPI() {
  let textFile = await fetch("pi_dec_1m.txt");

  fullPI = await textFile.text();

  fullPIcopy = fullPI.slice();
}

function resetEverything() {
  counter = 0;
  counterText.innerHTML = counter;
  paused = false;
  fullPI = fullPIcopy;
  piTextRef.innerHTML = "3.";
  if (learningMode) {
    learningTextRef.innerHTML = fullPI.charAt(0);
  }
}

let learningTextTimeout;

function main() {
  loadPI();
  updateHighScore();

  document.addEventListener(
    "keydown",
    (event) => {
      var digit = event.key;

      if (isNaN(digit)) return;

      if (!paused || learningMode) {
        console.log(digit, fullPI.charAt(0));
        if (digit === fullPI.charAt(0)) {
          fullPI = fullPI.substring(1);

          let node = document.createElement("letter");
          node.innerHTML = digit;
          piTextRef.appendChild(node);

          if (learningMode) {
            learningChar.innerHTML = fullPI.charAt(0);
            learningChar.classList.add("hidden");
            setTimeout(() => {
              learningChar.classList?.remove("hidden");
            }, 1500);
          }

          if (counter == 0) {
            timeOfFirstChar = Math.round(new Date().getTime() / 1000);
          }

          counter++;

          counterText.innerHTML = counter;
        } else {
          let node = document.createElement("letter");

          node.classList.add("incorr");

          node.innerHTML = fullPI.charAt(0);

          piTextRef.appendChild(node);

          fullPI = fullPI.substring(1);

          if (!learningMode) {
            paused = true;
            timeOfLastChar = Math.round(new Date().getTime() / 1000);
          } else {
            learningChar.innerHTML = fullPI.charAt(0);
            learningChar.classList.add("hidden");
            setTimeout(() => {
              learningChar.classList.remove("hidden");
            }, 1500);
          }
        }
      }
    },
    false
  );

  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      resetButton.focus();
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!learningMode) {
        updateHighScore();
      }
      resetEverything();
    } else if (e.key == "Escape") {
      e.preventDefault();
      resetEverything();
    }
  });
}

function updateHighScore() {
  const currentHighScore = localStorage.getItem("highScore") || 0;

  if (counter > currentHighScore) {
    localStorage.setItem("highScore", counter);
    document.getElementById("highScore").innerHTML = counter;
  } else {
    document.getElementById("highScore").innerHTML = currentHighScore;
  }
}

main();

document.addEventListener("DOMContentLoaded", (event) => {
  const checkbox = document.getElementById("learningMode");

  checkbox.addEventListener("change", (event) => {
    learningMode = event.target.checked;
    if (event.target.checked) {
      learningTextRef.classList.remove("hidden");
      learningChar.innerHTML = fullPI.charAt(0);
    } else {
      learningTextRef.classList.add("hidden");
      paused = false;
    }
  });
});
