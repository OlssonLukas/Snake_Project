let snake = [
  { x: 200, y: 250 },
  { x: 190, y: 250 },
  { x: 180, y: 250 },
  { x: 170, y: 250 }
]

let snakeIncrement = 0;

let snakeColors = [
  '#FF0000', '#a10101',
  '#ffa500', '#a16a04',
  '#FFFF00', '#919102',
  '#008000', '#015a01',
  '#0000FF', '#020292',
  '#4b0082', '#2f0250',
  '#ee82ee', '#5e345e'
]

// breaks for some reason
// const sqlite3 = require('better-sqlite3');
// const db = new sqlite3.Database('./score.db', sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the chinook database.');
// });

let score = 0;

//<video hidden id="dancing" width="320" height="240" autoplay muted loop>
//<source src="dancing.mp4" type="video/mp4">
//</source></video>

let movedThisTurn = false;
let startMusic = true;
var myMusic = new Audio('/sounds/snakeMusic.mp3');
myMusic.loop = true;
var gameOverSound = new Audio('/sounds/gameOver.wav');
var tastySound = new Audio('/sounds/mmmNoise.wav');
var munchSound = new Audio('/sounds/munchNoise.wav');

gameResetBoolean = false;

let food_x;
let food_y;

let dx = 10;
let dy = 0;

const snakeboard = document.getElementById("board");
const snakeboard_ctx = snakeboard.getContext("2d");

main();

genFood();

document.addEventListener("keydown", changeDirection)
const ldancer = document.getElementById("left_dancer");
const rdancer = document.getElementById("right_dancer");

function main() {
  if (startMusic) {
    myMusic.play();
  }
  gameStart();
}

function gameStart() {
  if (hasGameEnded()) {
    myMusic.pause();
    gameOverSound.play();
    openScore();
    return;
  }

  danceMaker();

  movedThisTurn = false;
  setTimeout(function onTick() {
    drawCanvas();
    drawFood();
    moveSnake();
    drawSnake();

    main();
  }, 60)
}

function reset() {
  //highScores = getHighScores();
  snake = [
    { x: 200, y: 250 },
    { x: 190, y: 250 },
    { x: 180, y: 250 },
    { x: 170, y: 250 }
  ]
  score = 0;
  document.getElementById('score').innerHTML = score;
  dx = 10;
  dy = 0;
  if (startMusic) {
    myMusic.play();
  }
  main();
}

// breaks cause its not connected to DB
function getHighScores() {
  allScores = runQuery(res, {},
    `SELECT * FROM scores`, false);
  console.log(allScores);
}

function drawCanvas() {
  snakeboard_ctx.fillStyle = '#9ADAD4';
  snakeboard_ctx.strokestyle = '#12093e';
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function danceMaker() {

  if (score >= 100) {
    var ldancer = document.getElementById("left_dancer");
    var rdancer = document.getElementById("right_dancer");
    ldancer.removeAttribute("hidden");
    rdancer.removeAttribute("hidden");
  }

}
function drawSnake() {
  snake.forEach(drawSnakePart)
  snakeIncrement = 0;
}

function drawSnakePart(snakePart) {

  snakeboard_ctx.fillStyle = snakeColors[snakeIncrement % 14];
  snakeboard_ctx.strokestyle = snakeColors[(snakeIncrement % 14) + 1];
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
  snakeIncrement += 2;
}

function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function genFood() {
  food_x = randomFood(0, snakeboard.width - 10);
  food_y = randomFood(0, snakeboard.height - 10);
  snake.forEach(function hasSnakeEatenFood(part) {
    const hasEaten = part.x == food_x && part.y == food_y;
    if (hasEaten) {
      genFood();
    }
  });
}

function drawFood() {
  snakeboard_ctx.fillStyle = 'lightgreen';
  snakeboard_ctx.strokestyle = 'darkgreen';
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const ate = snake[0].x === food_x && snake[0].y === food_y;
  if (ate) {
    score += 10;
    if ((score % 50) == 0) {
      tastySound.play();
    } else {
      munchSound.play();
    }
    document.getElementById('score').innerHTML = score;
    genFood();
  } else {
    snake.pop();
  }
}

function openScore() {
  document.getElementById("myScore").style.display = "block";
}

function closeForm() {
  document.getElementById("myScore").style.display = "none";
}

function hasGameEnded() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function changeDirection(event) {


  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (movedThisTurn) return;
  movedThisTurn = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }

  function runQuery(res, parameters, sqlForPreparedStatement, onlyOne = false) {
    let result;
    try {
      let stmt = db.prepare(sqlForPreparedStatement);

      let method = sqlForPreparedStatement.trim().toLowerCase().indexOf('select') === 0 ?
        'all' : 'run';
      result = stmt[method](parameters);
    }
    catch (error) {

      result = { _error: error + '' };
    }
    if (onlyOne) { result = result[0]; }
    result = result || null;
    res.status(result ? (result._error ? 500 : 200) : 404);
    res.json(result);
  }
}