# Snake Game Update 1: Evil Snake Gamemode

## Overview
This update introduces a new challenging gamemode called "Evil Snake" where hostile AI-controlled snakes periodically spawn and attempt to kill the player. Players can counter by colliding with the evil snakes' heads to eliminate them for bonus points.

## New Features
- **Evil Snake Mode**: A new gamemode toggle accessible via a button on the main screen.
- **Evil Snakes**: AI-controlled snakes that spawn every 10-15 seconds.
- **Hostile Behavior**: Evil snakes move towards the player's snake to cause collisions.
- **Counter-Attack**: Players can kill evil snakes by colliding with their heads, earning bonus points.
- **Visual Distinction**: Evil snakes appear in a different color (e.g., red) to distinguish from the player.

## Gameplay Mechanics (Evil Mode)
- **Spawning**: Evil snakes spawn at random locations on the grid, starting with 3 segments.
- **AI Movement**: Evil snakes use simple pathfinding to move towards the player's head position.
- **Collision Rules**:
  - Player head collides with evil snake body: Game over.
  - Player body collides with evil snake: Game over.
  - Player head collides with evil snake head: Evil snake dies, +50 points bonus.
- **Multiple Enemies**: Up to 3 evil snakes can be active simultaneously.
- **Food**: Normal food spawning continues, +10 points each.
- **Score Multiplier**: Total score includes normal food points plus evil snake kill bonuses.

## User Interface Updates
- **Mode Toggle**: "Normal Mode" / "Evil Mode" button to switch gamemodes.
- **Display**: Show active evil snakes count (optional).
- **Game Over**: Same as normal mode, but with updated scoring.

## Technical Requirements
- **AI Implementation**: Simple A* or greedy pathfinding for evil snake movement.
- **State Management**: Track multiple snakes, their directions, and AI logic.
- **Performance**: Ensure smooth gameplay with multiple entities (player + up to 3 evil snakes).
- **Code Structure**: Modular functions for evil snake spawning, AI movement, and collision detection.

## Implementation Notes
- **Evil Snake AI**: Use Manhattan distance or basic direction towards player.
- **Spawning Logic**: Timer-based spawning, check for valid spawn positions (not on existing snakes/food).
- **Collision Detection**: Extend existing collision checks to handle evil snakes.
- **Scoring**: Update score calculation to include bonuses.
- **Mode Persistence**: Optionally save preferred mode in localStorage.

## Balance Considerations
- **Difficulty**: Evil snakes should be challenging but not impossible to avoid/kill.
- **Spawn Rate**: 10-15 seconds to allow player adaptation.
- **Bonus Points**: 50 points per kill to encourage aggressive play.
- **Max Enemies**: Limit to 3 to prevent overwhelming the player.

## Future Enhancements
- Different evil snake types (faster, longer, etc.).
- Power-ups for temporary invincibility.
- Multiplayer evil mode.

## References
- Inspired by competitive snake games with AI opponents.</content>
<parameter name="filePath">c:\Users\landsharkYT\Documents\CSS382\FirstAIProject\AIProject\update1.md