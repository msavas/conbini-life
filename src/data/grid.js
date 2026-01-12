/**
 * Conbini Life - Grid System
 * Utilities for grid-based positioning and tile management
 */

import { CONFIG } from '../core/config.js';
import { Renderer } from '../rendering/renderer.js';

// Tile type definitions
const TILE_TYPES = {
  FLOOR: 'floor',
  WALL: 'wall',
  SHELF: 'shelf',
  REGISTER: 'register',
  DOOR: 'door',
  BACKROOM: 'backroom'
};

// Tile colors for placeholder rendering
const TILE_COLORS = {
  [TILE_TYPES.FLOOR]: CONFIG.COLORS.FLOOR,
  [TILE_TYPES.WALL]: CONFIG.COLORS.WALL,
  [TILE_TYPES.SHELF]: CONFIG.COLORS.SHELF,
  [TILE_TYPES.REGISTER]: CONFIG.COLORS.REGISTER,
  [TILE_TYPES.DOOR]: CONFIG.COLORS.DOOR,
  [TILE_TYPES.BACKROOM]: '#4a4458'
};

const Grid = {
  TILE_TYPES,
  TILE_COLORS,

  /**
   * Convert grid coordinates to pixel coordinates
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridY - Grid Y coordinate
   * @returns {{x: number, y: number}} Pixel coordinates
   */
  gridToPixel(gridX, gridY) {
    return {
      x: gridX * CONFIG.TILE_PX,
      y: gridY * CONFIG.TILE_PX
    };
  },

  /**
   * Convert pixel coordinates to grid coordinates
   * @param {number} pixelX - Pixel X coordinate
   * @param {number} pixelY - Pixel Y coordinate
   * @returns {{x: number, y: number}} Grid coordinates
   */
  pixelToGrid(pixelX, pixelY) {
    return {
      x: Math.floor(pixelX / CONFIG.TILE_PX),
      y: Math.floor(pixelY / CONFIG.TILE_PX)
    };
  },

  /**
   * Check if a grid position is within bounds
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridY - Grid Y coordinate
   * @returns {boolean} True if position is valid
   */
  isValidPosition(gridX, gridY) {
    return gridX >= 0 && gridX < CONFIG.GRID_SIZE.width &&
           gridY >= 0 && gridY < CONFIG.GRID_SIZE.height;
  },

  /**
   * Get the center pixel position of a grid cell
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridY - Grid Y coordinate
   * @returns {{x: number, y: number}} Center pixel coordinates
   */
  getCellCenter(gridX, gridY) {
    const halfTile = CONFIG.TILE_PX / 2;
    return {
      x: gridX * CONFIG.TILE_PX + halfTile,
      y: gridY * CONFIG.TILE_PX + halfTile
    };
  },

  /**
   * Render a single tile at grid position
   * @param {number} gridX - Grid X coordinate
   * @param {number} gridY - Grid Y coordinate
   * @param {string} tileType - Type of tile (from TILE_TYPES)
   */
  renderTile(gridX, gridY, tileType) {
    const color = TILE_COLORS[tileType] || TILE_COLORS[TILE_TYPES.FLOOR];
    Renderer.drawTile(gridX, gridY, color);
  },

  /**
   * Render a grid of tiles from a 2D array
   * @param {string[][]} tileMap - 2D array of tile types
   */
  renderTileMap(tileMap) {
    for (let y = 0; y < tileMap.length; y++) {
      for (let x = 0; x < tileMap[y].length; x++) {
        this.renderTile(x, y, tileMap[y][x]);
      }
    }
  },

  /**
   * Calculate Manhattan distance between two grid positions
   * @param {number} x1 - First X coordinate
   * @param {number} y1 - First Y coordinate
   * @param {number} x2 - Second X coordinate
   * @param {number} y2 - Second Y coordinate
   * @returns {number} Manhattan distance
   */
  distance(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  },

  /**
   * Check if a position can be moved to (boundary + collision check)
   * @param {number} gridX - Target grid X coordinate
   * @param {number} gridY - Target grid Y coordinate
   * @returns {boolean} True if position is valid and walkable
   */
  canMoveTo(gridX, gridY) {
    // Boundary check
    if (gridX < 0 || gridX >= CONFIG.GRID_SIZE.width) return false;
    if (gridY < 0 || gridY >= CONFIG.GRID_SIZE.height) return false;

    // Walkability check (use global ShopLayout to avoid circular import)
    if (window.ShopLayout) {
      return window.ShopLayout.isWalkable(gridX, gridY);
    }

    // Fallback if ShopLayout not loaded yet
    return true;
  }
};

// Make globally accessible
window.Grid = Grid;

export { Grid, TILE_TYPES };
