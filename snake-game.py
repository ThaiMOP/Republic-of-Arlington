<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Retro Snake Game</title>
  <style>
    body {
      margin: 0;
      background: black;
      color: lime;
      font-family: monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    canvas {
      background: #111;
      border: 3px solid lime;
    }
    h1 {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <h1>Retro Snake Game</h1>
  <canvas id="game" width="400" height="400"></canvas>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const scale = 20;
    const rows = canvas.height / scale;
    const cols = canvas.width / scale;let snake, food, powerUp, score = 0, speed = 200, interval;

class Snake {
  constructor() {
    this.body = [{ x: 10, y: 10 }];
    this.dir = { x: 1, y: 0 };
    this.grow = false;
  }
  update() {
    const head = { x: this.body[0].x + this.dir.x, y: this.body[0].y + this.dir.y };
    if (this.collision(head)) return false;
    this.body.unshift(head);
    if (!this.grow) this.body.pop();
    else this.grow = false;
    return true;
  }
  draw() {
    ctx.fillStyle = 'lime';
    this.body.forEach(p => ctx.fillRect(p.x * scale, p.y * scale, scale, scale));
  }
  changeDir(x, y) {
    if (x !== -this.dir.x && y !== -this.dir.y) this.dir = { x, y };
  }
  collision(pos) {
    return (
      pos.x < 0 || pos.y < 0 || pos.x >= cols || pos.y >= rows ||
      this.body.some(p => p.x === pos.x && p.y === pos.y)
    );
  }
}

function randomPos() {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

function startGame() {
  snake = new Snake();
  food = randomPos();
  powerUp = null;
  score = 0;
  speed = 200;
  clearInterval(interval);
  interval = setInterval(loop, speed);
}

function loop() {
  if (!snake.update()) return gameOver();
  if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
    score += 10;
    snake.grow = true;
    food = randomPos();
    if (score % 50 === 0) powerUp = randomPos();
    speed = Math.max(50, speed - 10);
    clearInterval(interval);
    interval = setInterval(loop, speed);
  }
  if (powerUp && snake.body[0].x === powerUp.x && snake.body[0].y === powerUp.y) {
    score += 30;
    snake.grow = true;
    powerUp = null;
  }
  draw();
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  snake.draw();
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
  if (powerUp) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(powerUp.x * scale, powerUp.y * scale, scale, scale);
  }
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 10, 390);
}

function gameOver() {
  clearInterval(interval);
  alert('Game Over! Final Score: ' + score);
  startGame();
}

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp': snake.changeDir(0, -1); break;
    case 'ArrowDown': snake.changeDir(0, 1); break;
    case 'ArrowLeft': snake.changeDir(-1, 0); break;
    case 'ArrowRight': snake.changeDir(1, 0); break;
  }
});

startGame();

  </script>
</body>
</html>