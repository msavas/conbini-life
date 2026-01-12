/**
 * Conbini Life - Shop Layout Manager
 * Loads and renders the konbini floor layout from JSON data
 */

import { CONFIG } from '../core/config.js';
import { Events } from '../core/events.js';
import { Log } from '../core/log.js';
import { Grid, TILE_TYPES } from './grid.js';
import { Renderer } from '../rendering/renderer.js';

// Default layout (inline backup if JSON fails to load)
const DEFAULT_LAYOUT = [
  ['wall',  'register', 'wall',  'floor', 'floor', 'door',  'door',  'floor', 'floor', 'wall',  'shelf', 'wall'],
  ['floor', 'floor',    'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
  ['shelf', 'shelf',    'floor', 'shelf', 'shelf', 'floor', 'shelf', 'shelf', 'floor', 'shelf', 'shelf', 'wall'],
  ['floor', 'floor',    'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
  ['shelf', 'shelf',    'floor', 'shelf', 'shelf', 'floor', 'shelf', 'shelf', 'floor', 'shelf', 'shelf', 'wall'],
  ['floor', 'floor',    'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor'],
  ['shelf', 'shelf',    'floor', 'shelf', 'shelf', 'floor', 'shelf', 'shelf', 'floor', 'floor', 'backroom', 'backroom'],
  ['wall',  'wall',     'floor', 'wall',  'wall',  'floor', 'wall',  'wall',  'floor', 'wall',  'wall', 'wall']
];

const ShopLayout = {
  layout: DEFAULT_LAYOUT,
  loaded: false,
  zones: {},
  shelfContents: {},

  /**
   * Initialize shop layout (load from JSON if available)
   */
  async init() {
    try {
      const response = await fetch('/data/shop-layout.json');
      if (response.ok) {
        const data = await response.json();
        this.layout = data.layout;
        this.zones = data.zones || {};
        this.shelfContents = data.shelfContents || {};
        this.loaded = true;
        Log.info('ShopLayout', 'Loaded shop layout from JSON');
      }
    } catch (e) {
      Log.warn('ShopLayout', 'Using default layout (JSON load failed)', e);
    }

    return true;
  },

  /**
   * Get tile type at grid position
   * @param {number} x - Grid X
   * @param {number} y - Grid Y
   * @returns {string} Tile type
   */
  getTileAt(x, y) {
    if (!Grid.isValidPosition(x, y)) {
      return TILE_TYPES.WALL;
    }
    return this.layout[y]?.[x] || TILE_TYPES.FLOOR;
  },

  /**
   * Check if a position is walkable
   * @param {number} x - Grid X
   * @param {number} y - Grid Y
   * @returns {boolean}
   */
  isWalkable(x, y) {
    const tile = this.getTileAt(x, y);
    const walkable = ['floor', 'register', 'door', 'backroom'];
    return walkable.includes(tile);
  },

  /**
   * Get shelf contents at position
   * @param {number} x - Grid X
   * @param {number} y - Grid Y
   * @returns {string|null} Shelf content type or null
   */
  getShelfContents(x, y) {
    const key = `${x},${y}`;
    return this.shelfContents[key] || null;
  },

  /**
   * Render the entire shop layout
   */
  render() {
    for (let y = 0; y < this.layout.length; y++) {
      for (let x = 0; x < this.layout[y].length; x++) {
        const tileType = this.layout[y][x];
        Grid.renderTile(x, y, tileType);

        // Add visual detail for special tiles
        this.renderTileDetail(x, y, tileType);
      }
    }
  },

  /**
   * Render additional detail on special tiles
   * @param {number} x - Grid X
   * @param {number} y - Grid Y
   * @param {string} tileType - Type of tile
   */
  renderTileDetail(x, y, tileType) {
    const ctx = Renderer.getContext();
    const px = x * CONFIG.TILE_PX;
    const py = y * CONFIG.TILE_PX;

    switch (tileType) {
      case 'shelf':
        // Draw shelf lines to indicate shelving
        ctx.strokeStyle = '#77767b';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          const lineY = py + (CONFIG.TILE_PX * i / 4);
          ctx.beginPath();
          ctx.moveTo(px + 4, lineY);
          ctx.lineTo(px + CONFIG.TILE_PX - 4, lineY);
          ctx.stroke();
        }
        break;

      case 'register':
        // Draw register indicator
        ctx.fillStyle = '#f6d32d';
        ctx.fillRect(px + 12, py + 12, CONFIG.TILE_PX - 24, CONFIG.TILE_PX - 24);
        break;

      case 'door':
        // Draw door frame lines
        ctx.strokeStyle = '#57e389';
        ctx.lineWidth = 3;
        ctx.strokeRect(px + 4, py + 4, CONFIG.TILE_PX - 8, CONFIG.TILE_PX - 8);
        break;

      case 'backroom':
        // Draw backroom indicator (arrow)
        ctx.fillStyle = '#9a9996';
        ctx.beginPath();
        ctx.moveTo(px + CONFIG.TILE_PX - 10, py + CONFIG.TILE_PX / 2);
        ctx.lineTo(px + 10, py + 10);
        ctx.lineTo(px + 10, py + CONFIG.TILE_PX - 10);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }
};

// Subscribe to render event (render layout first, before entities)
Events.on('game:render', () => ShopLayout.render());

// Initialize on game init
Events.on('game:init', () => ShopLayout.init());

// Make globally accessible
window.ShopLayout = ShopLayout;

export { ShopLayout };
