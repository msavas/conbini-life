/**
 * Conbini Life - Canvas Renderer
 * Handles all Canvas 2D drawing operations
 */

import { CONFIG } from '../core/config.js';

const Renderer = {
  canvas: null,
  ctx: null,

  /**
   * Initialize the renderer with a canvas
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @returns {boolean} Success status
   */
  init(canvas) {
    if (!canvas) {
      console.error('[Renderer] No canvas provided');
      return false;
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    if (!this.ctx) {
      console.error('[Renderer] Could not get 2D context');
      return false;
    }

    // Disable image smoothing for pixel-perfect rendering
    this.ctx.imageSmoothingEnabled = false;

    return true;
  },

  /**
   * Clear the entire canvas
   * @param {string} [color] - Fill color (defaults to floor color)
   */
  clear(color = CONFIG.COLORS.FLOOR) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /**
   * Draw a filled rectangle
   * @param {number} x - X position in pixels
   * @param {number} y - Y position in pixels
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @param {string} color - Fill color
   */
  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  },

  /**
   * Draw a rectangle outline
   * @param {number} x - X position in pixels
   * @param {number} y - Y position in pixels
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @param {string} color - Stroke color
   * @param {number} [lineWidth=1] - Line width
   */
  drawRectOutline(x, y, width, height, color, lineWidth = 1) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
  },

  /**
   * Draw a tile at grid position
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridY - Grid Y coordinate
   * @param {string} color - Fill color
   */
  drawTile(gridX, gridY, color) {
    const x = gridX * CONFIG.TILE_PX;
    const y = gridY * CONFIG.TILE_PX;
    this.drawRect(x, y, CONFIG.TILE_PX, CONFIG.TILE_PX, color);
  },

  /**
   * Draw text
   * @param {string} text - Text to draw
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} [color='#fff'] - Text color
   * @param {string} [font='16px monospace'] - Font style
   */
  drawText(text, x, y, color = '#fff', font = '16px monospace') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
  },

  /**
   * Get the 2D context (for advanced operations)
   * @returns {CanvasRenderingContext2D}
   */
  getContext() {
    return this.ctx;
  }
};

// Make globally accessible
window.Renderer = Renderer;

export { Renderer };
