/**
 * Conbini Life - Input System
 * Keyboard event handling for player movement
 */

import { Events } from '../core/events.js';

const Input = {
  keys: {},

  /**
   * Initialize input system with keyboard listeners
   */
  init() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (!this.keys[e.key]) {
          this.keys[e.key] = true;
          Events.emit('input:direction', { direction: this.keyToDirection(e.key) });
        }
      }

      // Handle interaction key (E)
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        Events.emit('input:interact', {});
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  },

  /**
   * Map arrow key to direction string
   * @param {string} key - Arrow key name
   * @returns {string} Direction (up/down/left/right)
   */
  keyToDirection(key) {
    const map = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    };
    return map[key];
  }
};

// Make globally accessible
window.Input = Input;

export { Input };
