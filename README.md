# Snake Game (Web)

A simple browser-based Snake game built with HTML, CSS, and vanilla JavaScript.
This project is designed for fast local use and Netlify deployment.

## Features
- Classic snake core gameplay
- Arrow keys + WASD controls
- Score and top-20 leaderboard stored in `localStorage`
- Evil Mode with AI enemy snakes (red), including:
  - immediate spawn on game start
  - periodic additional spawns
  - enemy head collision kills evil snake for bonus points
- Collision detection for walls, self, and enemy snakes

## Files
- `index.html` - main page
- `style.css` - layout and visuals
- `script.js` - game logic
- `specs.md` - feature specs and design goals
- `update1.md` - Evil Mode functionality notes

## How to run
1. Open `index.html` directly in your browser, or
2. Run a local server:
   - `python -m http.server 8000`
   - Open `http://localhost:8000`

## Controls
- Arrow keys: move up/down/left/right
- WASD: alternative movement controls
- Start/Pause/Restart buttons
- Mode toggle between Normal and Evil

## Netlify deployment
1. Connect Git repository to Netlify or drag-and-drop project folder in Netlify UI.
2. No build step required; static site is served as-is.

## Notes
- Evil snakes are red and spawn in safe grid positions.
- Leaderboard stores the top 20 scores, automatically updated on game over.

## Development
- Update `script.js` for gameplay adjustments.
- Style in `style.css`.
- Keep `index.html` minimal and dependency-free.


## Requirements
vhuang7
Vincent Huang
https://github.com/landsharkYT/AIProject
Make a simple website that plays the game Snake but with modifiers and affects. But with an evil snake mode.
https://brilliant-kitsune-39533c.netlify.app/