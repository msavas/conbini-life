/**
 * Conbini Life - Main Game Module
 * Entry point for game initialization and Semi-Fixed Timestep loop
 */

import { CONFIG } from './config.js';
import { Events } from './events.js';
import { Log } from './log.js';
import { Renderer } from '../rendering/renderer.js';
import { Grid } from '../data/grid.js';
import { ShopLayout } from '../data/shop-layout.js';
import { Player } from '../entities/player.js';
import { Input } from '../systems/input.js';
import { Shelves } from '../entities/shelf.js';

// Game state
const Game = {
  canvas: null,
  ctx: null,
  running: false,
  initialized: false,
  lastTime: 0,
  accumulator: 0,

  // Expose constants for testing
  TICK_MS: CONFIG.TICK_MS,

  /**
   * Initialize the game
   */
  init() {
    Log.info('Game', 'Initializing Conbini Life...');

    // Get canvas and context
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) {
      Log.error('Game', 'Canvas element not found!');
      return false;
    }

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      Log.error('Game', 'Could not get 2D context!');
      return false;
    }

    // Set canvas dimensions based on grid
    this.canvas.width = CONFIG.CANVAS_WIDTH;
    this.canvas.height = CONFIG.CANVAS_HEIGHT;

    // Initialize renderer
    if (!Renderer.init(this.canvas)) {
      Log.error('Game', 'Failed to initialize renderer');
      return false;
    }

    Log.info('Game', `Canvas initialized: ${this.canvas.width}x${this.canvas.height}`);

    // Initialize input system
    Input.init();
    Log.info('Game', 'Input system initialized');

    this.initialized = true;
    Events.emit('game:init');
    return true;
  },

  /**
   * Start the game loop
   */
  start() {
    if (this.running) return;
    if (!this.initialized) {
      Log.error('Game', 'Cannot start - not initialized');
      return;
    }

    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;

    Log.info('Game', 'Game loop started');
    Events.emit('game:start');
    requestAnimationFrame((t) => this.loop(t));
  },

  /**
   * Main game loop - Semi-Fixed Timestep pattern
   * Fixed update rate (60/sec) with variable render and interpolation
   */
  loop(timestamp) {
    if (!this.running) return;

    // Calculate delta time
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Prevent spiral of death - cap accumulated time
    this.accumulator += Math.min(deltaTime, CONFIG.MAX_FRAME_TIME);

    // Fixed timestep updates at TICK_MS intervals
    while (this.accumulator >= CONFIG.TICK_MS) {
      this.update(CONFIG.TICK_MS);
      this.accumulator -= CONFIG.TICK_MS;
    }

    // Variable render with interpolation factor (alpha)
    const alpha = this.accumulator / CONFIG.TICK_MS;
    this.render(alpha);

    // Continue loop
    requestAnimationFrame((t) => this.loop(t));
  },

  /**
   * Fixed timestep update - called at consistent intervals
   * @param {number} dt - Delta time in milliseconds (always TICK_MS)
   */
  update(dt) {
    Events.emit('game:update', { dt });
  },

  /**
   * Render with interpolation
   * @param {number} alpha - Interpolation factor (0-1) for smooth rendering
   */
  render(alpha) {
    // Clear canvas
    Renderer.clear();

    // Emit render event for other systems to draw
    Events.emit('game:render', { ctx: this.ctx, alpha });
  },

  /**
   * Stop the game loop
   */
  stop() {
    this.running = false;
    Log.info('Game', 'Game loop stopped');
    Events.emit('game:stop');
  }
};

// Make Game globally accessible for testing
window.Game = Game;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (Game.init()) {
      Game.start();
    }
  });
} else {
  if (Game.init()) {
    Game.start();
  }
}

export { Game };
