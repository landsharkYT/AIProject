const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverDiv = document.getElementById('game-over');
const scoreList = document.getElementById('score-list');
const modeBtn = document.getElementById('mode-btn');

const gridSize = 20;
const tileCount = 20;
const tileSize = canvas.width / tileCount;

let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = {x: 15, y: 15};
let score = 0;
let scores = JSON.parse(localStorage.getItem('snakeScores')) || [];
let evilSnakes = [];
let evilMode = false;
let spawnTimer = 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

updateLeaderboard();

function updateLeaderboard() {
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 20);
    highScoreElement.textContent = scores[0] || 0;
    scoreList.innerHTML = '';
    scores.forEach((s, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${s}`;
        scoreList.appendChild(li);
    });
}

function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize - 2, tileSize - 2);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach(segment => drawTile(segment.x, segment.y, 'green'));
    
    // Draw evil snakes
    evilSnakes.forEach(evil => {
        evil.body.forEach(segment => drawTile(segment.x, segment.y, 'red'));
    });
    
    // Draw food
    drawTile(food.x, food.y, 'blue');
}

function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Check evil snake collisions
    for (let evil of evilSnakes) {
        if (evil.body.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        if (evil.body[0].x === head.x && evil.body[0].y === head.y) {
            // Kill evil snake
            score += 50;
            scoreElement.textContent = score;
            evilSnakes = evilSnakes.filter(e => e !== evil);
            return;
        }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function moveEvilSnakes() {
    evilSnakes.forEach(evil => {
        const playerHead = snake[0];
        const evilHead = evil.body[0];
        
        let dx = playerHead.x - evilHead.x;
        let dy = playerHead.y - evilHead.y;
        
        // Choose direction to move closer
        let newDir = {x: 0, y: 0};
        if (Math.abs(dx) > Math.abs(dy)) {
            newDir.x = dx > 0 ? 1 : -1;
        } else {
            newDir.y = dy > 0 ? 1 : -1;
        }
        
        // Avoid reverse
        if (newDir.x === -evil.direction.x && newDir.y === -evil.direction.y) {
            // If would reverse, choose perpendicular
            if (Math.abs(dx) > Math.abs(dy)) {
                newDir = {x: 0, y: dy > 0 ? 1 : -1};
            } else {
                newDir = {x: dx > 0 ? 1 : -1, y: 0};
            }
        }
        
        evil.direction = newDir;
        
        const newHead = {x: evilHead.x + newDir.x, y: evilHead.y + newDir.y};
        
        // Check wall
        if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
            evilSnakes = evilSnakes.filter(e => e !== evil);
            return;
        }
        
        // Check self
        if (evil.body.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            evilSnakes = evilSnakes.filter(e => e !== evil);
            return;
        }
        
        evil.body.unshift(newHead);
        evil.body.pop();
    });
}

function generateFood() {
    do {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    } while (
        snake.some(segment => segment.x === food.x && segment.y === food.y) ||
        evilSnakes.some(evil => evil.body.some(segment => segment.x === food.x && segment.y === food.y))
    );
}

function spawnEvilSnake() {
    if (evilSnakes.length >= 3) return;
    
    let x, y;
    do {
        x = Math.floor(Math.random() * tileCount);
        y = Math.floor(Math.random() * tileCount);
    } while (
        snake.some(s => s.x === x && s.y === y) ||
        evilSnakes.some(e => e.body.some(b => b.x === x && b.y === y)) ||
        (food.x === x && food.y === y)
    );
    
    const evil = {
        body: [{x, y}, {x: x-1, y}, {x: x-2, y}],
        direction: {x: 1, y: 0}
    };
    evilSnakes.push(evil);
}

function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    gamePaused = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    gameOverDiv.classList.remove('hidden');
    
    scores.push(score);
    localStorage.setItem('snakeScores', JSON.stringify(scores));
    updateLeaderboard();
}

function startGame() {
    if (gameRunning) return;
    
    snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    direction = {x: 1, y: 0};
    evilSnakes = [];
    spawnTimer = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameRunning = true;
    gamePaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    gameOverDiv.classList.add('hidden');
    
    gameLoop = setInterval(() => {
        if (!gamePaused) {
            moveSnake();
            if (evilMode) {
                moveEvilSnakes();
                spawnTimer++;
                if (spawnTimer % 50 === 0) { // every 10 seconds
                    spawnEvilSnake();
                }
            }
            drawGame();
        }
    }, 200);
}

function pauseGame() {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
}

function handleKeyPress(e) {
    if (!gameRunning) return;
    
    const key = e.key;
    if (key === 'ArrowUp' && direction.y === 0) direction = {x: 0, y: -1};
    else if (key === 'ArrowDown' && direction.y === 0) direction = {x: 0, y: 1};
    else if (key === 'ArrowLeft' && direction.x === 0) direction = {x: -1, y: 0};
    else if (key === 'ArrowRight' && direction.x === 0) direction = {x: 1, y: 0};
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', startGame);
modeBtn.addEventListener('click', () => {
    evilMode = !evilMode;
    modeBtn.textContent = evilMode ? 'Normal Mode' : 'Evil Mode';
});
document.addEventListener('keydown', handleKeyPress);

// Initial draw
drawGame();