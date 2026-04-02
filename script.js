const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverDiv = document.getElementById('game-over');
const scoreList = document.getElementById('score-list');
const evilCountElement = document.getElementById('evil-count');
const modeBtn = document.getElementById('mode-btn');
const currentModeSpan = document.getElementById('current-mode');

const gridSize = 20;
const tileCount = 20;
const tileSize = canvas.width / tileCount;

let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = {x: 15, y: 15};
let score = 0;
let scores = JSON.parse(localStorage.getItem('snakeScores')) || [];
let evilSnakes = [];
let evilMode = true; // default to Evil mode to make behavior visible
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
    
    updateStatus();
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
        if (evil.body[0].x === head.x && evil.body[0].y === head.y) {
            // Kill evil snake head-first
            score += 50;
            scoreElement.textContent = score;
            evilSnakes = evilSnakes.filter(e => e !== evil);
            return;
        }
        if (evil.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
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
    
    // Check if evil touched player body (evil dies)
    evilSnakes = evilSnakes.filter(evil => {
        for (let segment of evil.body) {
            if (snake.some(s => s.x === segment.x && s.y === segment.y)) {
                score += 50; // bonus for evil touching us
                scoreElement.textContent = score;
                return false; // remove this evil
            }
        }
        return true; // keep this evil
    });
}

function moveEvilSnakes() {
    evilSnakes.forEach(evil => {
        const playerHead = snake[0];
        const evilHead = evil.body[0];
        
        // Get valid move options
        const options = [];
        const directions = [
            {x: 1, y: 0},
            {x: -1, y: 0},
            {x: 0, y: 1},
            {x: 0, y: -1}
        ];
        
        for (let dir of directions) {
            const newHead = {x: evilHead.x + dir.x, y: evilHead.y + dir.y};
            
            // Check bounds
            if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) continue;
            
            // Check self collision
            if (evil.body.some(segment => segment.x === newHead.x && segment.y === newHead.y)) continue;
            
            // Check reverse (allow but deprioritize)
            const isReverse = dir.x === -evil.direction.x && dir.y === -evil.direction.y;
            
            // Score: prefer direction toward player, but add slight randomness to avoid mirroring
            const dx = playerHead.x - newHead.x;
            const dy = playerHead.y - newHead.y;
            const distance = Math.abs(dx) + Math.abs(dy);
            const randomBonus = Math.random() * 2; // slight randomness
            const reverseBonus = isReverse ? 10 : 0; // deprioritize reversals
            
            options.push({dir, score: distance + randomBonus + reverseBonus});
        }
        
        // Choose lowest score direction
        if (options.length === 0) {
            // Trapped, try reverse
            const reverseDir = {x: -evil.direction.x, y: -evil.direction.y};
            const reverseHead = {x: evilHead.x + reverseDir.x, y: evilHead.y + reverseDir.y};
            if (reverseHead.x >= 0 && reverseHead.x < tileCount && reverseHead.y >= 0 && reverseHead.y < tileCount) {
                evil.direction = reverseDir;
            } else {
                evilSnakes = evilSnakes.filter(e => e !== evil);
                return;
            }
        } else {
            options.sort((a, b) => a.score - b.score);
            evil.direction = options[0].dir;
        }
        
        const newHead = {x: evilHead.x + evil.direction.x, y: evilHead.y + evil.direction.y};
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

function spawnEvilSnake(preferOpposite = false) {
    if (evilSnakes.length >= 3) return;

    let pos;
    if (preferOpposite && snake.length > 0) {
        pos = findOppositeSpawnPosition();
    }

    if (!pos) {
        pos = findRandomSpawnPosition();
    }

    if (!pos) {
        console.warn('Could not spawn evil snake: no valid position found');
        return;
    }

    const {x, y} = pos;
    const evil = {
        body: [{x, y}, {x: x + 1, y}, {x: x + 2, y}],
        direction: {x: 1, y: 0}
    };
    evilSnakes.push(evil);
    console.log('Spawned evil snake at', x, y, 'for mode', evilMode ? 'Evil' : 'Normal');
}

function findOppositeSpawnPosition() {
    const px = snake[0].x;
    const py = snake[0].y;
    const center = tileCount / 2;

    const startX = px < center ? tileCount - 4 : 1;
    const dirs = [0, 1, -1, 2, -2, 3, -3];

    for (let dy of dirs) {
        const y = py + dy;
        if (y < 0 || y >= tileCount) continue;
        if (isValidSpawnPosition(startX, y)) return {x: startX, y};
    }

    return null;
}

function findRandomSpawnPosition() {
    let attempts = 0;
    while (attempts < 200) {
        const x = Math.floor(Math.random() * (tileCount - 3));
        const y = Math.floor(Math.random() * tileCount);
        if (isValidSpawnPosition(x, y)) return {x, y};
        attempts++;
    }
    return null;
}

function isValidSpawnPosition(x, y) {
    // const playerHead = snake[0];
    // const distance = Math.abs(playerHead.x - x) + Math.abs(playerHead.y - y);
    // if (distance < 4) return false; // not too close to player
    
    // Check all body positions are free
    for (let i = 0; i < 3; i++) {
        const bx = x + i;
        const by = y;
        if (bx >= tileCount || by >= tileCount || bx < 0 || by < 0) return false; // out of bounds
        if (snake.some(s => s.x === bx && s.y === by)) return false;
        if (evilSnakes.some(e => e.body.some(b => b.x === bx && b.y === by))) return false;
        if (food.x === bx && food.y === by) return false;
    }
    return true;
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

function updateStatus() {
    evilCountElement.textContent = evilSnakes.length;
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
    if (evilMode) {
        spawnEvilSnake(true); // Spawn one immediately on opposite side of player
        if (evilSnakes.length === 0) {
            spawnEvilSnake(false); // fallback
        }
    }
    drawGame(); // immediate frame show, no wait
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
    
    const key = e.key.toLowerCase();
    if ((key === 'arrowup' || key === 'w') && direction.y === 0) direction = {x: 0, y: -1};
    else if ((key === 'arrowdown' || key === 's') && direction.y === 0) direction = {x: 0, y: 1};
    else if ((key === 'arrowleft' || key === 'a') && direction.x === 0) direction = {x: -1, y: 0};
    else if ((key === 'arrowright' || key === 'd') && direction.x === 0) direction = {x: 1, y: 0};
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', startGame);
modeBtn.addEventListener('click', () => {
    evilMode = !evilMode;
    currentModeSpan.textContent = `Current Mode: ${evilMode ? 'Evil' : 'Normal'}`;
});
document.addEventListener('keydown', handleKeyPress);

// Initial draw
drawGame();