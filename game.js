const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");

// Biến và hằng số
let gameOver = false;
let score = 0;
let lives = 3;
let levels = 3;
// Tạo bóng
let dx = 2;
let dy = -2;
const ball = {
  x: cvs.width / 2,
  y: cvs.height - 30,
  radius: 10,
  speed: 3,
};
// Tạo mái chèo
const paddle = {
  height: 15,
  width: 120,
  x: cvs.width / 2 - 60,
  y: cvs.height - 15,
  speed: 5,
  movingLeft: false,
  movingRight: false,
};
// Tạo các viên gạch
const brick = {
  width: 120,
  height: 30,
  offset: 25,
  offsetTop: 25,
  margin: 40,
  r: 3,
  c: 5,
};
// Vẽ mái chèo
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}


// Cài đặt nút
document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    paddle.movingLeft = false;
  } else if (event.keyCode == 39) {
    paddle.movingRight = false;
  }
});
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    paddle.movingLeft = true;
  } else if (event.keyCode == 39) {
    paddle.movingRight = true;
  }
});
// Tạo chuyển động mái chèo
function movePaddle() {
  if (paddle.movingLeft) {
    paddle.x -= paddle.speed;
  } else if (paddle.movingRight) {
    paddle.x += paddle.speed;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  } else if (paddle.x > cvs.width - paddle.width) {
    paddle.x = cvs.width - paddle.width;
  }
}
// Xử lý va chạm giữa bóng và mái chèo
function ballPaddleCollision() {
  if (
    ball.x + ball.radius >= paddle.x &&
    ball.x - ball.radius <= paddle.x + paddle.width &&
    ball.y + ball.radius >= cvs.height - paddle.height
  ) {
    // Tính toán điểm va chạm trên mái chèo
    const collidePoint = ball.x - (paddle.x + paddle.width / 2);
    // Chuyển đổi góc dựa trên vị trí va chạm trên mái chèo
    const maxAngle = Math.PI / 3; // Góc tối đa
    const angle = (collidePoint / paddle.width / 2) * maxAngle ;
    // Tính toán hướng mới cho bóng
    dx = Math.sin(angle) * ball.speed;
    dy = -Math.cos(angle) * ball.speed;
  }
}
// Vẽ bóng
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// Xử lý va chạm giữa bóng và tường
function ballWallCollision() {
  if (ball.x > cvs.width - ball.radius || ball.x < ball.radius) {
    dx = -dx;
  }

  if (ball.y < ball.radius) {
    dy = -dy;
  }
  if (ball.y > cvs.height - ball.radius) {
    lives--;
    resetGame();
    if(!lives){
      alert("Game Over")
    }
  }
}
// Tạo chuyển động bóng
function moveBall() {
  ball.x += dx;
  ball.y += dy;
}
// Tạo các viên gạch
let bricks = [];
for (let r = 0; r < brick.r; r++) {
  for (let c = 0; c < brick.c; c++) {
    bricks.push({
      x: c * (brick.offset + brick.width) + brick.offset,
      y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.margin,
      status: 1,
    });
  }
}
// Vẽ các viên gạch
function drawBricks() {
  bricks.forEach(function (b) {
    if (b.status) {
      ctx.beginPath();
      ctx.rect(b.x, b.y, brick.width, brick.height);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  });
}
// Sử lý va chạm
function ballBrickCollision() {
  bricks.forEach(function (b) {
    if (b.status) {
      if (
        ball.x + ball.radius >= b.x &&
        ball.x - ball.radius <= b.x + brick.width &&
        ball.y + ball.radius >= b.y &&
        ball.y - ball.radius <= b.y + brick.height
      ) {
        dy = -dy;
        b.status = 0;
        score += 10;
      }
    }
  });
}
// Tính điểm
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}
// Tính mạng
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, cvs.width - 65, 20);
}
// Game over
function checkGameOver() {
  if (lives <= 0) {
    gameOver = true;
  }
}

// Đặt lại vị trí ban đầu của bóng và mái chèo
function resetGame() {
  ball.x = cvs.width / 2;
  ball.y = cvs.height - 30;
  paddle.x = cvs.width / 2 - 60;
}

function draw() {
  if (!gameOver) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    moveBall();
    ballWallCollision();
    movePaddle();
    ballPaddleCollision();
    ballBrickCollision();
    checkGameOver();
    requestAnimationFrame(draw);
  }
}
draw();