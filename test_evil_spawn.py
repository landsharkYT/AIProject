import random

class SnakeGameCore:
    def __init__(self, tile_count=20):
        self.tile_count = tile_count

    def is_valid_spawn_position(self, state, x, y):
        if x < 0 or y < 0 or x + 2 >= self.tile_count or y >= self.tile_count:
            return False
        for i in range(3):
            bx = x + i
            by = y
            if bx < 0 or bx >= self.tile_count or by < 0 or by >= self.tile_count:
                return False
            if any(s['x'] == bx and s['y'] == by for s in state['snake']):
                return False
            if any(any(b['x'] == bx and b['y'] == by for b in evil['body']) for evil in state['evil_snakes']):
                return False
            if state['food']['x'] == bx and state['food']['y'] == by:
                return False
        return True

    def find_opposite_spawn_position(self, state):
        px = state['snake'][0]['x']
        py = state['snake'][0]['y']
        center = self.tile_count / 2
        start_x = self.tile_count - 4 if px < center else 1
        offsets = [0, 1, -1, 2, -2, 3, -3]

        for dy in offsets:
            y = py + dy
            if y < 0 or y >= self.tile_count:
                continue
            if self.is_valid_spawn_position(state, start_x, y):
                return {'x': start_x, 'y': y}
        return None

    def find_random_spawn_position(self, state):
        attempts = 0
        while attempts < 500:
            x = random.randint(0, self.tile_count - 4)
            y = random.randint(0, self.tile_count - 1)
            if self.is_valid_spawn_position(state, x, y):
                return {'x': x, 'y': y}
            attempts += 1
        return None

    def spawn_evil_snake(self, state, prefer_opposite=False):
        if len(state['evil_snakes']) >= 3:
            return False

        pos = None
        if prefer_opposite and state['snake']:
            pos = self.find_opposite_spawn_position(state)
        if pos is None:
            pos = self.find_random_spawn_position(state)
        if pos is None:
            return False

        evil = {
            'body': [{'x': pos['x'], 'y': pos['y']}, {'x': pos['x'] + 1, 'y': pos['y']}, {'x': pos['x'] + 2, 'y': pos['y']}],
            'direction': {'x': 1, 'y': 0}
        }
        state['evil_snakes'].append(evil)
        return True


def make_initial_state():
    return {
        'snake': [{'x': 10, 'y': 10}, {'x': 9, 'y': 10}, {'x': 8, 'y': 10}],
        'evil_snakes': [],
        'food': {'x': 5, 'y': 5}
    }

core = SnakeGameCore(20)

print('Running evil spawn tests')

state = make_initial_state()
assert core.spawn_evil_snake(state, True)
assert len(state['evil_snakes']) == 1
evil = state['evil_snakes'][0]
assert evil['body'][0]['x'] == 1, f"evil should spawn opposite side (x=1) for player x=10, got {evil['body'][0]['x']}"
assert 0 <= evil['body'][0]['y'] < 20

# New failing test: ensure evil is on opposite side of player even when player starts on left side
state = make_initial_state()
state['snake'] = [{'x': 1, 'y': 10}, {'x': 0, 'y': 10}, {'x': 19, 'y': 10}]
state['food'] = {'x': 5, 'y': 5}
assert core.spawn_evil_snake(state, True)
evil = state['evil_snakes'][0]
assert evil['body'][0]['x'] == 16, f"evil should spawn opposite side (x=16) for player x=1, got {evil['body'][0]['x']}"

state = make_initial_state()
state['snake'] = [{'x': 1, 'y': 10}, {'x': 2, 'y': 10}, {'x': 3, 'y': 10}]
state['food'] = {'x': 0, 'y': 0}
assert core.spawn_evil_snake(state, True)
assert not (state['evil_snakes'][0]['body'][0]['x'] == 1 and state['evil_snakes'][0]['body'][0]['y'] == 10)

state = make_initial_state()
state['evil_snakes'] = [
    {'body': [{'x': 1, 'y': 10}, {'x': 2, 'y': 10}, {'x': 3, 'y': 10}]},
    {'body': [{'x': 5, 'y': 5}, {'x': 6, 'y': 5}, {'x': 7, 'y': 5}]},
    {'body': [{'x': 10, 'y': 12}, {'x': 11, 'y': 12}, {'x': 12, 'y': 12}]}
]
assert not core.spawn_evil_snake(state, True)

print('All tests passed!')
