const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const levelEl = document.getElementById("level");
const overlay = document.getElementById("overlay");

const box = 20;
let snake, snakeSet, direction, food, score, game, speed, started = false;


const LEVEL_SPEED = { 150: 140, 100: 100, 60: 75 };


let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = highScore;

function init() {
  snake = [{ x: 200, y: 200 }];
  snakeSet = new Set(["200,200"]); 
  direction = "RIGHT";
  score = 0;
  started = false;

  scoreEl.innerText = score;
  highScoreEl.innerText = highScore;

  overlay.innerText = "Press Arrow Key to Start";
  overlay.style.display = "block";

  speed = LEVEL_SPEED[levelEl.value];
  food = randomFood();

  if (game) clearInterval(game);
}


function randomFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } while (snakeSet.has(newFood.x + "," + newFood.y));
  return newFood;
}


document.addEventListener("keydown", e => {
  if (!started) {
    startCountdown();
    started = true;
  }

  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});


function startCountdown() {
  let count = 3;
  overlay.style.display = "block";

  let timer = setInterval(() => {
    overlay.innerText = count > 0 ? count : "GO!";
    count--;

    if (count < -1) {
      clearInterval(timer);
      overlay.style.display = "none";
      game = setInterval(drawGame, speed);
    }
  }, 700);
}

function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);


  ctx.fillStyle = "lime";
  snake.forEach(p => ctx.fillRect(p.x, p.y, box, box));

  
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { ...snake[0] };

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  let key = head.x + "," + head.y;


  if (
    head.x < 0 || head.y < 0 ||
    head.x >= 400 || head.y >= 400 ||
    snakeSet.has(key)
  ) {
    clearInterval(game);
    overlay.innerText = "Game Over! Press Restart";
    overlay.style.display = "block";
    return;
  }


  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreEl.innerText = highScore;
    }

    food = randomFood();
  } else {
    let tail = snake.pop();
    snakeSet.delete(tail.x + "," + tail.y);
  }

  snake.unshift(head);
  snakeSet.add(key);
}

function restartGame() {
  init();
}

init();