# Snake Game Specifications

## Overview
This document outlines the specifications for a classic Snake game implemented as a static website, designed for quick deployment on Netlify within 30 minutes. The game follows traditional Snake mechanics with a focus on simplicity and performance.

## Gameplay Mechanics
- **Grid System**: 20x20 grid (400 cells total).
- **Snake**: Starts with 3 segments, moves continuously in one of four directions (up, down, left, right).
- **Food**: Randomly placed apple that appears after being eaten.
- **Growth**: Snake grows by 1 segment each time food is consumed.
- **Collision Detection**:
  - Wall collision: Game over.
  - Self-collision: Game over.
- **Scoring**: 10 points per food eaten.
- **Speed**: Constant speed, no acceleration for simplicity.
- **Game States**: Playing, Game Over, Paused (optional).

## User Interface
- **Game Area**: HTML5 Canvas (400x400 pixels) or CSS Grid for rendering.
- **Controls**: Arrow keys for direction change.
- **Display Elements**:
  - Current score.
  - High score (stored in localStorage).
  - Game over screen with restart option.
- **Responsive Design**: Centered layout, works on desktop and mobile.
- **Styling**: Clean, minimal design with green snake, red food, black background.

## Technical Requirements
- **Languages**: HTML5, CSS3, JavaScript (ES6+).
- **No External Dependencies**: Vanilla JS only, no frameworks or libraries.
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge).
- **Performance**: Smooth 60 FPS gameplay using requestAnimationFrame.
- **Code Structure**:
  - `index.html`: Main page structure.
  - `style.css`: Styling and layout.
  - `script.js`: Game logic, rendering, input handling.

## Deployment
- **Platform**: Netlify (static site hosting).
- **Files**: index.html, style.css, script.js (and optional assets like favicon).
- **Configuration**: No build process required; direct upload or git integration.
- **Domain**: Custom domain optional; Netlify provides free subdomain.
- **Time Estimate**: 30 minutes for implementation and deployment.

## Implementation Notes
- **Game Loop**: Use setInterval or requestAnimationFrame for updates.
- **State Management**: Objects for snake (array of positions), food position, direction, score.
- **Input Handling**: Prevent invalid direction changes (e.g., no reverse into self).
- **Rendering**: Canvas API for drawing, or DOM manipulation for grid.
- **Persistence**: High score in localStorage.
- **Testing**: Manual testing in browser; ensure no console errors.
- **Edge Cases**: Handle window resize, keyboard focus, mobile touch (optional).

## Future Enhancements (Optional)
- Levels with increasing speed.
- Power-ups (e.g., speed boost, shrink).
- Multiplayer mode.
- Sound effects.
- Themes (e.g., dark mode).

## References
- Classic Snake gameplay inspired by Nokia Snake and arcade originals.
- Wikipedia: Snake (video game genre).</content>
<parameter name="filePath">c:\Users\landsharkYT\Documents\CSS382\FirstAIProject\AIProject\specs.md