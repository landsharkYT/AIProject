class SnakeGameCore {
    constructor(tileCount = 20) {
        this.tileCount = tileCount;
    }

    isValidSpawnPosition(state, x, y) {
        if (x < 0 || y < 0 || x + 2 >= this.tileCount || y >= this.tileCount) return false;
        for (let i = 0; i < 3; i++) {
            const bx = x + i;
            const by = y;
            if (bx < 0 || bx >= this.tileCount || by < 0 || by >= this.tileCount) return false;
            if (state.snake.some(s => s.x === bx && s.y === by)) return false;
            if (state.evilSnakes.some(e => e.body.some(b => b.x === bx && b.y === by))) return false;
            if (state.food.x === bx && state.food.y === by) return false;
        }
        return true;
    }

    findOppositeSpawnPosition(state) {
        const px = state.snake[0].x;
        const py = state.snake[0].y;
        const center = this.tileCount / 2;
        const startX = px < center ? this.tileCount - 4 : 1;
        const offsets = [0, 1, -1, 2, -2, 3, -3];

        for (let dy of offsets) {
            const y = py + dy;
            if (y < 0 || y >= this.tileCount) continue;
            if (this.isValidSpawnPosition(state, startX, y)) {
                return {x: startX, y};
            }
        }
        return null;
    }

    findRandomSpawnPosition(state) {
        let attempts = 0;
        while (attempts < 500) {
            const x = Math.floor(Math.random() * (this.tileCount - 3));
            const y = Math.floor(Math.random() * this.tileCount);
            if (this.isValidSpawnPosition(state, x, y)) {
                return {x, y};
            }
            attempts++;
        }
        return null;
    }

    spawnEvilSnake(state, preferOpposite = false) {
        if (!state.evilSnakes) state.evilSnakes = [];
        if (state.evilSnakes.length >= 3) return false;

        let pos = null;
        if (preferOpposite && state.snake.length > 0) {
            pos = this.findOppositeSpawnPosition(state);
        }
        if (!pos) {
            pos = this.findRandomSpawnPosition(state);
        }
        if (!pos) return false;

        const evil = {
            body: [{x: pos.x, y: pos.y}, {x: pos.x + 1, y: pos.y}, {x: pos.x + 2, y: pos.y}],
            direction: {x: 1, y: 0}
        };
        state.evilSnakes.push(evil);
        return true;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnakeGameCore;
}
