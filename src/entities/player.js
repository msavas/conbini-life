/**
 * Conbini Life - Player Entity
 * Player state, movement, and rendering
 */

import { CONFIG } from '../core/config.js';
import { Events } from '../core/events.js';
import { Renderer } from '../rendering/renderer.js';
import { Grid } from '../data/grid.js';

// Player entity - plain object pattern per architecture
const Player = {
  type: 'player',

  // Logical grid position
  gridX: 5,
  gridY: 4,

  // Visual position for interpolation (lerps toward grid position)
  renderX: 5,
  renderY: 4,

  // State
  moving: false,
  direction: 'down', // 'up', 'down', 'left', 'right'
  moveSpeed: CONFIG.MOVE_SPEED, // Tiles per second

  // Visual properties
  width: CONFIG.TILE_PX - 8,  // Slightly smaller than tile
  height: CONFIG.TILE_PX - 4,
  color: CONFIG.COLORS.PLAYER,

  /**
   * Initialize player (reset to starting position)
   */
  init() {
    this.gridX = 5;
    this.gridY = 4;
    this.renderX = 5;
    this.renderY = 4;
    this.moving = false;
    this.direction = 'down';
  },

  /**
   * Attempt to move player in a direction
   * @param {string} direction - 'up', 'down', 'left', 'right'
   */
  move(direction) {
    if (this.moving) return; // Block input while moving

    const delta = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 }
    }[direction];

    if (!delta) return;

    const targetX = this.gridX + delta.dx;
    const targetY = this.gridY + delta.dy;

    if (Grid.canMoveTo(targetX, targetY)) {
      this.gridX = targetX;
      this.gridY = targetY;
      this.moving = true;
      this.direction = direction;
      Events.emit('player:move', { x: targetX, y: targetY, direction });
    }
  },

  /**
   * Update player state (called at fixed timestep)
   * @param {number} dt - Delta time in ms
   */
  update(dt) {
    if (!this.moving) return;

    const speed = this.moveSpeed * (dt / 1000);

    // Lerp renderX toward gridX
    if (this.renderX < this.gridX) {
      this.renderX = Math.min(this.renderX + speed, this.gridX);
    } else if (this.renderX > this.gridX) {
      this.renderX = Math.max(this.renderX - speed, this.gridX);
    }

    // Lerp renderY toward gridY
    if (this.renderY < this.gridY) {
      this.renderY = Math.min(this.renderY + speed, this.gridY);
    } else if (this.renderY > this.gridY) {
      this.renderY = Math.max(this.renderY - speed, this.gridY);
    }

    // Check if arrived
    if (this.renderX === this.gridX && this.renderY === this.gridY) {
      this.moving = false;
    }
  },

  /**
   * Render player sprite
   * @param {number} alpha - Interpolation factor (0-1)
   */
  render(alpha) {
    // Calculate pixel position with interpolation
    const pixelX = this.renderX * CONFIG.TILE_PX;
    const pixelY = this.renderY * CONFIG.TILE_PX;

    // Center player in tile
    const offsetX = (CONFIG.TILE_PX - this.width) / 2;
    const offsetY = (CONFIG.TILE_PX - this.height);

    // Draw player as colored rectangle (placeholder sprite)
    Renderer.drawRect(
      pixelX + offsetX,
      pixelY + offsetY,
      this.width,
      this.height,
      this.color
    );

    // Draw simple face indicator based on direction
    this.drawFaceIndicator(pixelX + offsetX, pixelY + offsetY);
  },

  /**
   * Draw a simple indicator showing player direction
   * @param {number} x - Player X position
   * @param {number} y - Player Y position
   */
  drawFaceIndicator(x, y) {
    const ctx = Renderer.getContext();
    const centerX = x + this.width / 2;
    const centerY = y + this.height / 3;

    ctx.fillStyle = '#fff';

    // Eyes
    const eyeOffset = 6;
    const eyeSize = 4;
    ctx.fillRect(centerX - eyeOffset - eyeSize/2, centerY, eyeSize, eyeSize);
    ctx.fillRect(centerX + eyeOffset - eyeSize/2, centerY, eyeSize, eyeSize);
  },

  /**
   * Get current pixel position
   * @returns {{x: number, y: number}}
   */
  getPixelPosition() {
    return Grid.gridToPixel(this.renderX, this.renderY);
  }
};

// Subscribe to game events
Events.on('game:update', ({ dt }) => Player.update(dt));
Events.on('game:render', ({ alpha }) => Player.render(alpha));

// Subscribe to input events
Events.on('input:direction', ({ direction }) => Player.move(direction));

// Make globally accessible
window.Player = Player;

export { Player };
