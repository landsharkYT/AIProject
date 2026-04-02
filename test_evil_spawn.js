const assert = require('assert');
const SnakeGameCore = require('./gameLogic');

const core = new SnakeGameCore(20);

function makeInitialState() {
    return {
        snake: [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}],
        evilSnakes: [],
        food: {x: 5, y: 5}
    };
}

console.log('Running evil spawn unit tests...');

// Test #1: opposite spawn logic should pick opposite side
let state = makeInitialState();
let result = core.spawnEvilSnake(state, true);
assert.strictEqual(result, true, 'spawnEvilSnake should return true');
assert.strictEqual(state.evilSnakes.length, 1, 'evil snake should exist after spawn');
let evil = state.evilSnakes[0];
assert.ok(evil.body[0].x === 1 || evil.body[0].x === 16, 'evil spawn x should be on opposite side (1 or 16)');
assert.ok(evil.body[0].y >= 0 && evil.body[0].y < 20, 'evil spawn y should be valid');

// Test #2: should not spawn where player is
state = makeInitialState();
state.snake = [{x: 1, y: 10}, {x: 2, y: 10}, {x: 3, y: 10}];
state.food = {x: 0, y: 0};
result = core.spawnEvilSnake(state, true);
assert.strictEqual(result, true, 'evil spawn should still succeed with alternate positions');
assert.ok(state.evilSnakes[0].body[0].x !== 1 || state.evilSnakes[0].body[0].y !== 10, 'evil should not spawn on player');

// Test #3: when grid is crowded, spawn returns false
state = makeInitialState();
state.evilSnakes = [{body: [{x:1,y:10},{x:2,y:10},{x:3,y:10}]},{body:[{x:5,y:5},{x:6,y:5},{x:7,y:5}]},{body:[{x:10,y:12},{x:11,y:12},{x:12,y:12}]}];
result = core.spawnEvilSnake(state, true);
assert.strictEqual(result, false, 'should not spawn if max evil snakes reached');

console.log('All tests passed!');
