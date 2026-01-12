/**
 * Conbini Life - Logging Utility
 * Tagged logging with debug flag control
 */

import { CONFIG } from './config.js';

const Log = {
  /**
   * Log info message
   * @param {string} tag - System/module tag
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  info(tag, message, data) {
    if (!CONFIG.DEBUG) return;
    if (data !== undefined) {
      console.log(`[${tag}] ${message}`, data);
    } else {
      console.log(`[${tag}] ${message}`);
    }
  },

  /**
   * Log warning message
   * @param {string} tag - System/module tag
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  warn(tag, message, data) {
    if (data !== undefined) {
      console.warn(`[${tag}] ${message}`, data);
    } else {
      console.warn(`[${tag}] ${message}`);
    }
  },

  /**
   * Log error message
   * @param {string} tag - System/module tag
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  error(tag, message, data) {
    if (data !== undefined) {
      console.error(`[${tag}] ${message}`, data);
    } else {
      console.error(`[${tag}] ${message}`);
    }
  },

  /**
   * Log debug message (only in debug mode)
   * @param {string} tag - System/module tag
   * @param {string} message - Log message
   * @param {*} [data] - Optional data to log
   */
  debug(tag, message, data) {
    if (!CONFIG.DEBUG) return;
    if (data !== undefined) {
      console.debug(`[${tag}] ${message}`, data);
    } else {
      console.debug(`[${tag}] ${message}`);
    }
  }
};

// Make globally accessible
window.Log = Log;

export { Log };
