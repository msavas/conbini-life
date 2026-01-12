/**
 * Conbini Life - Configuration Constants
 * Central location for all game configuration values
 */

const CONFIG = {
  // Game Loop
  TICK_RATE: 60,
  TICK_MS: 1000 / 60, // ~16.67ms
  MAX_FRAME_TIME: 250, // Prevent spiral of death

  // Grid
  GRID_SIZE: { width: 12, height: 8 },
  TILE_PX: 48,

  // Canvas (calculated from grid)
  get CANVAS_WIDTH() { return this.GRID_SIZE.width * this.TILE_PX; },
  get CANVAS_HEIGHT() { return this.GRID_SIZE.height * this.TILE_PX; },

  // Gameplay
  SHELF_MAX_STOCK: 9,
  MOVE_SPEED: 8, // Tiles per second for player movement

  // Colors (placeholder palette)
  COLORS: {
    FLOOR: '#3d3846',
    WALL: '#241f31',
    SHELF: '#5e5c64',
    REGISTER: '#c64600',
    DOOR: '#26a269',
    PLAYER: '#1c71d8'
  },

  // Debug
  DEBUG: true
};

// Freeze to prevent accidental modification
Object.freeze(CONFIG.GRID_SIZE);
Object.freeze(CONFIG.COLORS);

// Make globally accessible
window.CONFIG = CONFIG;

export { CONFIG };
