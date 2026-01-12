/**
 * Conbini Life - Shelf Entity System
 * Shelf entities, rendering, and interaction logic
 */

import { CONFIG } from '../core/config.js';
import { Events } from '../core/events.js';
import { Renderer } from '../rendering/renderer.js';
import { Grid } from '../data/grid.js';

// Category colors for shelf types
const CATEGORY_COLORS = {
  drinks: '#4a90d9',
  snacks: '#d9a84a',
  onigiri: '#7dd94a',
  bento: '#d94a4a',
  desserts: '#d94ad9',
  magazines: '#9b9b9b',
  icecream: '#4ad9d9',
  hotfood: '#d96a4a',
  instant: '#d9d94a',
  household: '#8b6b4a'
};

/**
 * Factory function to create a shelf entity
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @param {string} category - Shelf category (from CATEGORY_COLORS)
 * @returns {Object} Shelf entity
 */
function createShelf(gridX, gridY, category) {
  return {
    type: 'shelf',
    gridX,
    gridY,
    category,
    stockLevel: 0,
    maxStock: 9,

    /**
     * Check if shelf is empty
     * @returns {boolean}
     */
    isEmpty() {
      return this.stockLevel === 0;
    },

    /**
     * Check if shelf is full
     * @returns {boolean}
     */
    isFull() {
      return this.stockLevel >= this.maxStock;
    },

    /**
     * Get stock percentage
     * @returns {number} Stock percentage (0-1)
     */
    getStockPercent() {
      return this.stockLevel / this.maxStock;
    }
  };
}

// Shelves collection object
const Shelves = {
  entities: [],

  /**
   * Initialize shelves from layout data
   * @param {Object} layoutData - Layout data containing shelfContents
   */
  init(layoutData) {
    this.entities = [];

    if (!layoutData || !layoutData.shelfContents) {
      return;
    }

    // Create shelf entities from shelfContents (keys are "x,y" strings)
    for (const key in layoutData.shelfContents) {
      const [x, y] = key.split(',').map(Number);
      const category = layoutData.shelfContents[key];
      const shelf = createShelf(x, y, category);
      this.entities.push(shelf);
    }
  },

  /**
   * Get shelf at grid position
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridY - Grid Y coordinate
   * @returns {Object|undefined} Shelf entity or undefined
   */
  getAt(gridX, gridY) {
    return this.entities.find(shelf =>
      shelf.gridX === gridX && shelf.gridY === gridY
    );
  },

  /**
   * Get shelves adjacent to a position (4 cardinal directions)
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridY - Grid Y coordinate
   * @returns {Object[]} Array of adjacent shelf entities
   */
  getAdjacent(gridX, gridY) {
    const directions = [
      { dx: 0, dy: -1 },  // up
      { dx: 0, dy: 1 },   // down
      { dx: -1, dy: 0 },  // left
      { dx: 1, dy: 0 }    // right
    ];

    const adjacent = [];
    for (const dir of directions) {
      const shelf = this.getAt(gridX + dir.dx, gridY + dir.dy);
      if (shelf) {
        adjacent.push(shelf);
      }
    }
    return adjacent;
  }
};

/**
 * Render a single shelf
 * @param {Object} shelf - Shelf entity
 */
function renderShelf(shelf) {
  const ctx = Renderer.getContext();
  const { x, y } = Grid.gridToPixel(shelf.gridX, shelf.gridY);
  const size = CONFIG.TILE_PX;

  // Draw base tile with category color
  const color = CATEGORY_COLORS[shelf.category] || CONFIG.COLORS.SHELF;
  Renderer.drawRect(x, y, size, size, color);

  // Draw stock items as small white rectangles in 3x3 grid pattern
  const itemSize = 10;
  const padding = 6;
  const spacing = (size - padding * 2 - itemSize * 3) / 2;

  for (let i = 0; i < shelf.stockLevel; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const itemX = x + padding + col * (itemSize + spacing);
    const itemY = y + padding + row * (itemSize + spacing);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(itemX, itemY, itemSize, itemSize);
  }

  // Draw dark overlay if empty
  if (shelf.stockLevel === 0) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x, y, size, size);
  }
}

/**
 * Render interaction indicator for a shelf
 * @param {Object} shelf - Shelf entity
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function renderInteractionIndicator(shelf, ctx) {
  const { x, y } = Grid.gridToPixel(shelf.gridX, shelf.gridY);
  const size = CONFIG.TILE_PX;

  // Pulsing effect using Date.now()
  const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;

  // Draw pulsing white border
  ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);

  // Draw "[E]" text prompt above the shelf
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[E]', x + size / 2, y - 8);
  ctx.textAlign = 'left'; // Reset text align
}

/**
 * Get the shelf in the player's facing direction
 * @param {Object} player - Player entity
 * @returns {Object|undefined} Shelf entity or undefined
 */
function getInteractionTarget(player) {
  const directionDelta = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 }
  };

  const delta = directionDelta[player.direction];
  if (!delta) return undefined;

  const targetX = player.gridX + delta.dx;
  const targetY = player.gridY + delta.dy;

  return Shelves.getAt(targetX, targetY);
}

// Subscribe to game:init event
Events.on('game:init', () => {
  Shelves.init(window.ShopLayout);
});

// Subscribe to game:render event
Events.on('game:render', () => {
  const ctx = Renderer.getContext();

  // Render all shelves
  for (const shelf of Shelves.entities) {
    renderShelf(shelf);
  }

  // Render interaction indicator if player is adjacent to a shelf
  if (window.Player) {
    const target = getInteractionTarget(window.Player);
    if (target) {
      renderInteractionIndicator(target, ctx);
    }
  }
});

// Handle interaction input
Events.on('input:interact', () => {
  if (!window.Player) return;

  const target = getInteractionTarget(window.Player);
  if (target) {
    Events.emit('player:interact', {
      shelf: target,
      category: target.category,
      stockLevel: target.stockLevel,
      gridX: target.gridX,
      gridY: target.gridY
    });
    console.log('[Shelf] Interaction:', target.category, `at (${target.gridX},${target.gridY})`, `stock: ${target.stockLevel}/${target.maxStock}`);
  }
});

// Make globally accessible
window.Shelves = Shelves;

export { createShelf, Shelves, CATEGORY_COLORS, getInteractionTarget };
