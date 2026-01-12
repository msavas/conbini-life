/**
 * Conbini Life - Event Bus
 * Pub/Sub pattern for decoupled communication between game systems
 * Event naming convention: namespace:action (e.g., 'player:move', 'shelf:stocked')
 */

const Events = {
  listeners: {},

  /**
   * Subscribe to an event
   * @param {string} event - Event name (e.g., 'player:move')
   * @param {Function} callback - Handler function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Handler to remove
   */
  off(event, callback) {
    if (!this.listeners[event]) return;

    const index = this.listeners[event].indexOf(callback);
    if (index > -1) {
      this.listeners[event].splice(index, 1);
    }
  },

  /**
   * Emit an event to all subscribers
   * @param {string} event - Event name
   * @param {*} data - Data to pass to handlers
   */
  emit(event, data) {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error(`[Events] Error in handler for '${event}':`, e);
      }
    });
  },

  /**
   * Subscribe to an event for one-time execution
   * @param {string} event - Event name
   * @param {Function} callback - Handler function
   */
  once(event, callback) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    this.on(event, wrapper);
  },

  /**
   * Clear all listeners for an event (or all events if no event specified)
   * @param {string} [event] - Event name (optional)
   */
  clear(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
};

// Make globally accessible
window.Events = Events;

export { Events };
